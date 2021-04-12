<svelte:options immutable={true} />

<script lang="ts">
  import type { Editor, KeyMap, Linter, Annotation } from 'codemirror';
  import type { Root, Element } from 'hast';
  import type { VFile } from 'vfile';
  import type {
    BytemdEditorContext,
    BytemdLocale,
    BytemdPlugin,
    EditorProps,
  } from './types';
  import { onMount, createEventDispatcher, onDestroy, tick } from 'svelte';
  import debounce from 'lodash.debounce';
  import throttle from 'lodash.throttle';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';
  import Toc from './toc.svelte';
  import {
    createEditorUtils,
    findStartIndex,
    getBuiltinActions,
    handleImageUpload,
  } from './editor';
  import Status from './status.svelte';
  import { icons } from './icons';
  import en from './locales/en.json';
  import deepmerge from 'deepmerge';
  import Help from './help.svelte';
  import factory from 'codemirror-ssr';
  import usePlaceholder from 'codemirror-ssr/addon/display/placeholder';
  import useOverlay from 'codemirror-ssr/addon/mode/overlay.js';
  import useXml from 'codemirror-ssr/mode/xml/xml';
  import useMarkdown from 'codemirror-ssr/mode/markdown/markdown';
  import useGfm from 'codemirror-ssr/mode/gfm/gfm';
  import useYaml from 'codemirror-ssr/mode/yaml/yaml';
  import useYamlFrontmatter from 'codemirror-ssr/mode/yaml-frontmatter/yaml-frontmatter';
  import useVim from 'codemirror-ssr/keymap/vim';
  import useEmacs from 'codemirror-ssr/keymap/emacs';
  import useLint from 'codemirror-ssr/addon/lint/lint';

  export let value: EditorProps['value'] = '';
  export let plugins: NonNullable<EditorProps['plugins']> = [];
  export let sanitize: EditorProps['sanitize'];
  export let mode: NonNullable<EditorProps['mode']> = 'auto';
  export let previewDebounce: NonNullable<EditorProps['previewDebounce']> = 300;
  export let placeholder: EditorProps['placeholder'];
  export let editorConfig: EditorProps['editorConfig'];
  export let locale: EditorProps['locale'];
  export let uploadImages: EditorProps['uploadImages'];
  export let overridePreview: EditorProps['overridePreview'];

  // do deep merge to support incomplete locales, use en as fallback
  $: mergedLocale = deepmerge(en, locale ?? {}) as BytemdLocale;

  const dispatch = createEventDispatcher();

  $: actions = getBuiltinActions(mergedLocale, plugins, uploadImages);
  $: split = mode === 'split' || (mode === 'auto' && containerWidth >= 800);
  $: ((_) => {
    // reset active tab
    if (split) activeTab = false;
  })(split);

  let root: HTMLElement;
  let previewEl: HTMLElement;
  let textarea: HTMLTextAreaElement;
  let containerWidth = Infinity; // TODO: first screen

  let codemirror: ReturnType<typeof factory>;
  let editor: Editor;
  let activeTab: false | 'write' | 'preview';
  let fullscreen = false;
  let sidebar: false | 'help' | 'toc' = false;

  $: styles = (() => {
    let edit: string;
    let preview: string;

    if (split && activeTab === false) {
      if (sidebar) {
        edit = `width:calc(50% - ${sidebar ? 140 : 0}px)`;
        preview = `width:calc(50% - ${sidebar ? 140 : 0}px)`;
      } else {
        edit = 'width:50%';
        preview = 'width:50%';
      }
    } else if (activeTab === 'preview') {
      edit = 'display:none';
      preview = `width:calc(100% - ${sidebar ? 280 : 0}px)`;
    } else {
      edit = `width:calc(100% - ${sidebar ? 280 : 0}px)`;
      preview = 'display:none';
      // TODO: use width:0 to make scroll sync work until
      // the position calculation improved (causes white screen after switching to editor only)
    }

    return { edit, preview };
  })();

  $: context = (() => {
    const context: BytemdEditorContext = {
      // @ts-ignore
      codemirror,
      editor,
      root,
      // @ts-ignore
      ...createEditorUtils(codemirror, editor),
    };
    return context;
  })();

  let cbs: ReturnType<NonNullable<BytemdPlugin['editorEffect']>>[] = [];
  let keyMap: KeyMap = {};

  function on() {
    // console.log('on', plugins);
    cbs = plugins.map((p) => p.editorEffect?.(context));

    keyMap = {};
    // TODO: nested shortcuts
    actions.forEach(({ handler }) => {
      if (handler?.type === 'action' && handler.shortcut) {
        keyMap[handler.shortcut] = () => {
          handler.click(context);
        };
      }
    });
    editor.addKeyMap(keyMap);
  }
  function off() {
    // console.log('off', plugins);
    cbs.forEach((cb) => cb && cb());

    editor.removeKeyMap(keyMap);
  }

  let debouncedValue = value;
  const setDebouncedValue = debounce((value: string) => {
    debouncedValue = value;

    overridePreview?.(previewEl, { value: debouncedValue, plugins, sanitize });
  }, previewDebounce);
  $: setDebouncedValue(value);

  $: if (editor && value !== editor.getValue()) {
    editor.setValue(value);
  }

  $: if (editor && plugins) {
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
  let vfile: VFile;
  let currentBlockIndex = 0;

  onMount(async () => {
    codemirror = factory();
    usePlaceholder(codemirror);
    useOverlay(codemirror);
    useXml(codemirror); // inline html highlight
    useMarkdown(codemirror);
    useGfm(codemirror);
    useYaml(codemirror);
    useYamlFrontmatter(codemirror);
    useVim(codemirror);
    useEmacs(codemirror);
    useLint(codemirror);

    // lint
    const linter: Linter = () => {
      if (!vfile) return [];

      const annotations = vfile.messages.map((m) => {
        const a: Annotation = {
          from: codemirror.Pos(
            m.location.start.line - 1,
            m.location.start.column - 1
          ),
          to:
            m.location.end.line == null // TODO: why null?
              ? codemirror.Pos(m.location.start.line - 1)
              : codemirror.Pos(
                  m.location.end.line - 1,
                  m.location.end.column - 1
                ),
          message: m.message,
        };
        return a;
      });
      // console.log(annotations);
      return annotations;
    };

    editor = codemirror.fromTextArea(textarea, {
      mode: 'yaml-frontmatter',
      lineWrapping: true,
      tabSize: 8, // keep consistent with preview: https://developer.mozilla.org/en-US/docs/Web/CSS/tab-size#formal_definition
      indentUnit: 4, // nested ordered list does not work with 2 spaces
      ...editorConfig,
      placeholder,
      lint: linter,
    });

    // https://github.com/codemirror/CodeMirror/issues/2428#issuecomment-39315423
    // https://github.com/codemirror/CodeMirror/issues/988#issuecomment-392232020
    editor.addKeyMap({
      Tab: 'indentMore',
      'Shift-Tab': 'indentLess',
    });
    editor.setValue(value);
    editor.on('change', (doc, change) => {
      dispatch('change', { value: editor.getValue() });
    });

    const updateBlockPositions = throttle(() => {
      editPs = [];
      previewPs = [];

      const scrollInfo = editor.getScrollInfo();
      const body = previewEl.childNodes[0];
      if (!(body instanceof HTMLElement)) return;

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
      if (overridePreview) return;

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
      if (overridePreview) return;

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

    // handle image drop and paste
    const handleImages = async (
      e: Event,
      itemList: DataTransferItemList | undefined
    ) => {
      if (!uploadImages) return;

      const files = Array.from(itemList ?? [])
        .map((item) => {
          if (item.type.startsWith('image/')) {
            return item.getAsFile();
          }
        })
        .filter((f): f is File => f != null);

      if (files.length) {
        e.preventDefault(); // important
        await handleImageUpload(context, uploadImages, files);
      }
    };

    editor.on('drop', async (_, e) => {
      handleImages(e, e.dataTransfer?.items);
    });
    editor.on('paste', async (_, e) => {
      handleImages(e, e.clipboardData?.items);
    });

    // @ts-ignore
    new ResizeObserver((entries) => {
      containerWidth = entries[0].contentRect.width;
      // console.log(containerWidth);
    }).observe(root, { box: 'border-box' });

    // No need to call `on` because cm instance would change once after init
  });
  onDestroy(off);
</script>

<div
  class="bytemd"
  class:bytemd-split={split && activeTab === false}
  class:bytemd-fullscreen={fullscreen}
  bind:this={root}
>
  <Toolbar
    {context}
    {split}
    {activeTab}
    {sidebar}
    {fullscreen}
    locale={mergedLocale}
    {actions}
    on:key={(e) => {
      editor.setOption('keyMap', e.detail);
      editor.focus();
    }}
    on:tab={(e) => {
      const v = e.detail;
      if (split) {
        activeTab = activeTab === v ? false : v;
      } else {
        activeTab = v;
      }

      if (activeTab === 'write') {
        tick().then(() => {
          editor && editor.focus();
        });
      }
    }}
    on:click={(e) => {
      switch (e.detail) {
        case 'fullscreen':
          fullscreen = !fullscreen;
          break;
        case 'help':
          sidebar = sidebar === 'help' ? false : 'help';
          break;
        case 'toc':
          sidebar = sidebar === 'toc' ? false : 'toc';
          break;
      }
    }}
  />
  <div class="bytemd-body">
    <div class="bytemd-editor" style={styles.edit}>
      <textarea bind:this={textarea} class="bytemd-hidden" />
    </div>
    <div bind:this={previewEl} class="bytemd-preview" style={styles.preview}>
      {#if !overridePreview}
        <Viewer
          value={debouncedValue}
          {plugins}
          {sanitize}
          on:hast={(e) => {
            hast = e.detail.hast;
            vfile = e.detail.file;
          }}
        />
      {/if}
    </div>
    <div class="bytemd-sidebar" class:bytemd-hidden={sidebar === false}>
      <div
        class="bytemd-sidebar-close"
        on:click={() => {
          sidebar = false;
        }}
      >
        {@html icons.close}
      </div>
      <Help locale={mergedLocale} {actions} visible={sidebar === 'help'} />
      <Toc
        {hast}
        locale={mergedLocale}
        {currentBlockIndex}
        on:click={(e) => {
          const headings = previewEl.querySelectorAll('h1,h2,h3,h4,h5,h6');
          headings[e.detail].scrollIntoView();
        }}
        visible={sidebar === 'toc'}
      />
    </div>
  </div>
  <Status
    locale={mergedLocale}
    showSync={!overridePreview && split}
    value={debouncedValue}
    {syncEnabled}
    on:sync={(e) => {
      syncEnabled = e.detail;
    }}
    on:top={() => {
      editor.scrollTo(null, 0);
      previewEl.scrollTo({ top: 0 });
    }}
  />
</div>
