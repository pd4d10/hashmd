<svelte:options immutable={true} />

<script lang="ts">
  import type { Editor } from 'codemirror';
  import type { Root, Element } from 'hast';
  import type { BytemdPlugin, EditorProps, ViewerProps } from './types';
  import { onMount, createEventDispatcher, onDestroy, tick } from 'svelte';
  import { debounce, throttle } from 'lodash-es';
  import cx from 'classnames';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';
  import Toc from './toc.svelte';
  import { createUtils, findStartIndex, getBuiltinItems } from './editor';
  import Status from './status.svelte';
  import { icons } from './icons';
  import enUS from './locales/en-US';

  export let value: EditorProps['value'] = '';
  export let plugins: NonNullable<EditorProps['plugins']> = [];
  export let sanitize: EditorProps['sanitize'];
  export let mode: EditorProps['mode'] = 'split';
  export let previewDebounce: NonNullable<EditorProps['previewDebounce']> = 300;
  export let placeholder: EditorProps['placeholder'];
  export let editorConfig: EditorProps['editorConfig'];
  export let locale: NonNullable<EditorProps['locale']> = enUS;

  $: toolbarItems = getBuiltinItems(locale, plugins);

  let el: HTMLElement;
  let previewEl: HTMLElement;
  let textarea: HTMLTextAreaElement;

  let viewerProps: ViewerProps = { value, plugins, sanitize };
  let editor: Editor;
  let activeTab = 0;
  let fullscreen = false;
  let sidebar: false | 'help' | 'toc' = 'toc'; // false;

  $: styles = (() => {
    let edit: string;
    let preview: string;

    if (mode === 'tab') {
      if (activeTab === 0) {
        edit = `width:calc(100% - ${sidebar ? 280 : 0}px)`;
        preview = 'display:none';
      } else {
        edit = 'display:none';
        preview = `width:calc(100% - ${sidebar ? 280 : 0}px)`;
      }
    } else {
      if (sidebar) {
        edit = `width:calc(50% - ${sidebar ? 140 : 0}px)`;
        preview = `width:calc(50% - ${sidebar ? 140 : 0}px)`;
      } else {
        edit = 'width:50%';
        preview = 'width:50%';
      }
    }

    return { edit, preview };
  })();

  $: context = { editor, $el: el, utils: createUtils(editor) };

  let cbs: ReturnType<NonNullable<BytemdPlugin['editorEffect']>>[] = [];
  const dispatch = createEventDispatcher();

  function on() {
    // console.log('on', plugins);
    cbs = plugins.map((p) => p.editorEffect?.(context));
  }
  function off() {
    // console.log('off', plugins);
    cbs.forEach((cb) => cb && cb());
  }

  const updateViewerValue = debounce(() => {
    viewerProps = { value, plugins, sanitize };
  }, previewDebounce);

  $: if (editor && value !== editor.getValue()) {
    editor.setValue(value);
  }
  $: if (value != null) updateViewerValue();

  $: if (editor && el && plugins && hast) {
    off();
    tick().then(() => {
      on();
    });
  }

  // Scroll sync vars
  let syncEnabled = true;
  let editCalled = false;
  let previewCalled = false;
  let editPs: number[];
  let previewPs: number[];
  let hast: Root = { type: 'root', children: [] };
  let currentBlockIndex = 0;

  onMount(async () => {
    const [codemirror] = await Promise.all([
      import('codemirror'),
      // @ts-ignore
      import('codemirror/mode/gfm/gfm'),
      // @ts-ignore
      import('codemirror/mode/yaml-frontmatter/yaml-frontmatter'),
      import('codemirror/addon/display/placeholder'),
    ]);

    editor = codemirror.fromTextArea(textarea, {
      mode: 'yaml-frontmatter',
      lineWrapping: true,
      placeholder,
      ...editorConfig,
    });

    // https://github.com/codemirror/CodeMirror/issues/2428#issuecomment-39315423
    editor.addKeyMap({ 'Shift-Tab': 'indentLess' });
    editor.setValue(value);
    editor.on('change', (doc, change) => {
      dispatch('change', { value: editor.getValue() });
    });

    const updateBlockPositions = throttle(() => {
      editPs = [];
      previewPs = [];

      const scrollInfo = editor.getScrollInfo();
      const body = previewEl.querySelector<HTMLElement>('.markdown-body')!;

      const leftNodes = hast.children.filter(
        (v) => v.type === 'element'
      ) as Element[];
      const rightNodes = [...body.childNodes].filter(
        (v): v is HTMLElement => v instanceof HTMLElement
      );

      for (let i = 0; i < leftNodes.length; i++) {
        const leftNode = leftNodes[i];
        const rightNode = rightNodes[i];

        // if there is no position info, move to the next node
        if (!leftNode.position) {
          continue;
        }

        const left =
          editor.heightAtLine(leftNode.position.start.line - 1, 'local') /
          (scrollInfo.height - scrollInfo.clientHeight);
        const right =
          (rightNode.offsetTop - body.offsetTop) /
          (previewEl.scrollHeight - previewEl.clientHeight);

        if (left >= 1 || right >= 1) {
          break;
        }

        editPs.push(left);
        previewPs.push(right);
      }

      editPs.push(1);
      previewPs.push(1);
      // console.log(editPs, previewPs);
    }, 1000);
    const editorScrollHandler = () => {
      if (!syncEnabled) return;

      if (previewCalled) {
        previewCalled = false;
        return;
      }

      updateBlockPositions();

      const info = editor.getScrollInfo();
      const leftRatio = info.top / (info.height - info.clientHeight);

      const startIndex = findStartIndex(leftRatio, editPs);

      const rightRatio =
        ((leftRatio - editPs[startIndex]) *
          (previewPs[startIndex + 1] - previewPs[startIndex])) /
          (editPs[startIndex + 1] - editPs[startIndex]) +
        previewPs[startIndex];
      // const rightRatio = rightPs[startIndex]; // for testing

      previewEl.scrollTo(
        0,
        rightRatio * (previewEl.scrollHeight - previewEl.clientHeight)
      );
      editCalled = true;
    };
    const previewScrollHandler = () => {
      // find the current block in the view
      updateBlockPositions();
      currentBlockIndex = findStartIndex(
        previewEl.scrollTop / (previewEl.scrollHeight - previewEl.offsetHeight),
        previewPs
      );

      if (!syncEnabled) return;

      if (editCalled) {
        editCalled = false;
        return;
      }

      const rightRatio =
        previewEl.scrollTop / (previewEl.scrollHeight - previewEl.clientHeight);

      const startIndex = findStartIndex(rightRatio, previewPs);

      const leftRatio =
        ((rightRatio - previewPs[startIndex]) *
          (editPs[startIndex + 1] - editPs[startIndex])) /
          (previewPs[startIndex + 1] - previewPs[startIndex]) +
        editPs[startIndex];

      const info = editor.getScrollInfo();
      editor.scrollTo(0, leftRatio * (info.height - info.clientHeight));
      previewCalled = true;
    };

    editor.on('scroll', editorScrollHandler);
    previewEl.addEventListener('scroll', previewScrollHandler, {
      passive: true,
    });

    // No need to call `on` because cm instance would change once after init
  });
  onDestroy(off);
</script>

<div
  class={cx('bytemd', `bytemd-mode-${mode}`, {
    'bytemd-fullscreen': fullscreen,
  })}
  bind:this={el}
>
  <Toolbar
    {context}
    {mode}
    {activeTab}
    {sidebar}
    {fullscreen}
    {locale}
    {toolbarItems}
    on:tab={(e) => {
      activeTab = e.detail;
      if (activeTab === 0 && editor) {
        tick().then(() => {
          editor.focus();
        });
      }
    }}
    on:click={(e) => {
      switch (e.detail) {
        case 'fullscreen':
          fullscreen = !fullscreen;
          break;
        case 'help':
          if (sidebar === 'help') {
            sidebar = false;
          } else {
            sidebar = 'help';
          }
          break;
        case 'toc':
          if (sidebar === 'toc') {
            sidebar = false;
          } else {
            sidebar = 'toc';
          }
          break;
      }
    }}
  />
  <div class="bytemd-body">
    <div class="bytemd-editor" style={styles.edit}>
      <textarea bind:this={textarea} style="display:none" />
    </div>
    <div bind:this={previewEl} class="bytemd-preview" style={styles.preview}>
      <Viewer
        value={viewerProps.value}
        plugins={viewerProps.plugins}
        sanitize={viewerProps.sanitize}
        on:hast={(e) => {
          hast = e.detail;
        }}
      />
    </div>
    <div class="bytemd-sidebar" style={sidebar ? undefined : 'display:none'}>
      <div
        class="bytemd-sidebar-close"
        on:click={() => {
          sidebar = false;
        }}
      >
        {@html icons.close}
      </div>
      {#if sidebar === 'help'}
        <div class="bytemd-cheatsheet">
          <h2>{locale.help.cheatsheet}</h2>
          <ul>
            {#each toolbarItems as item}
              {#if item.cheatsheet}
                <li>
                  <span class="bytemd-cheatsheet-icon">{@html item.icon}</span
                  ><span class="bytemd-cheatsheet-text">{item.title}</span><span
                    class="bytemd-cheatsheet-syntax">{item.cheatsheet}</span
                  >
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      {:else if sidebar === 'toc'}
        <Toc
          {hast}
          {locale}
          {currentBlockIndex}
          on:click={(e) => {
            const headings = previewEl.querySelectorAll('h1,h2,h3,h4,h5,h6');
            headings[e.detail].scrollIntoView();
          }}
        />
      {/if}
    </div>
  </div>
  <Status
    {locale}
    scrollVisible={mode === 'split'}
    {value}
    {syncEnabled}
    on:sync={(e) => {
      syncEnabled = e.detail;
    }}
    on:top={() => {
      previewEl.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  />
</div>
