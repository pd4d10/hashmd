<script lang="ts">
  import type { Editor } from 'codemirror';
  import type {} from 'codemirror/addon/display/placeholder';
  import type { Root } from 'mdast';
  import type { BytemdPlugin, EditorProps, ViewerProps } from './types';
  import { onMount, createEventDispatcher, onDestroy, tick } from 'svelte';
  import debounce from 'lodash.debounce';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';

  export let value: EditorProps['value'] = '';
  export let plugins: EditorProps['plugins'];
  export let sanitize: EditorProps['sanitize'];
  export let mode: EditorProps['mode'] = 'split';
  export let previewDebounce: EditorProps['previewDebounce'] = 300;
  export let toolbar: EditorProps['toolbar'];
  export let editorConfig: EditorProps['editorConfig'];

  let el: HTMLElement;
  let previewEl: HTMLElement;
  let viewerProps: ViewerProps = {
    value,
    plugins,
    sanitize,
  };
  let textarea: HTMLTextAreaElement;
  let editor: Editor;
  let activeTab = 0;
  let fullscreen = false;

  $: context = { editor, $el: el };

  let cbs: ReturnType<NonNullable<BytemdPlugin['editorEffect']>>[] = [];
  const dispatch = createEventDispatcher();

  // @ts-ignore
  function setActiveTab(e) {
    activeTab = e.detail.value;
    if (editor && activeTab === 0) {
      tick().then(() => {
        editor.focus();
      });
    }
  }

  // scroll sync
  let editorCalled = false;
  let viewerCalled = false;

  function findStartIndex(num: number, nums: number[]) {
    let startIndex = nums.length - 2;
    for (let i = 0; i < nums.length; i++) {
      if (num < nums[i]) {
        startIndex = i - 1;
        break;
      }
    }
    return startIndex;
  }

  function editorScrollHandler() {
    if (viewerCalled) {
      viewerCalled = false;
      return;
    }

    requestAnimationFrame(() => {
      updateBlockPositions();

      const info = editor.getScrollInfo();
      const leftRatio = info.top / (info.height - info.clientHeight);

      const startIndex = findStartIndex(leftRatio, leftPs);

      const rightRatio =
        ((leftRatio - leftPs[startIndex]) *
          (rightPs[startIndex + 1] - rightPs[startIndex])) /
          (leftPs[startIndex + 1] - leftPs[startIndex]) +
        rightPs[startIndex];
      // const rightRatio = rightPs[startIndex];

      previewEl.scrollTo(
        0,
        rightRatio * (previewEl.scrollHeight - previewEl.clientHeight)
      );
      editorCalled = true;
    });
  }
  function previewScrollHandler() {
    if (editorCalled) {
      editorCalled = false;
      return;
    }

    requestAnimationFrame(() => {
      const rightRatio =
        previewEl.scrollTop / (previewEl.scrollHeight - previewEl.clientHeight);

      const startIndex = findStartIndex(rightRatio, rightPs);

      const leftRatio =
        ((rightRatio - rightPs[startIndex]) *
          (leftPs[startIndex + 1] - leftPs[startIndex])) /
          (rightPs[startIndex + 1] - rightPs[startIndex]) +
        leftPs[startIndex];

      const info = editor.getScrollInfo();
      editor.scrollTo(0, leftRatio * (info.height - info.clientHeight));
      viewerCalled = true;
    });
  }

  function on() {
    cbs = (plugins ?? []).map((p) => p.editorEffect?.(context));
    editor.on('scroll', editorScrollHandler);
    previewEl.addEventListener('scroll', previewScrollHandler, {
      passive: true,
    });
  }
  function off() {
    cbs.forEach((cb) => cb && cb());
    editor.off('scroll', editorScrollHandler);
    previewEl.removeEventListener('scroll', previewScrollHandler);
  }

  const updateViewerValue = debounce(() => {
    viewerProps = {
      value,
      plugins,
      sanitize,
    };
  }, previewDebounce);

  $: if (editor && value !== editor.getValue()) {
    editor.setValue(value);
  }
  $: if (value != null) updateViewerValue();

  $: if (editor && el && plugins) {
    off();
    tick().then(() => {
      on();
    });
  }

  let mdast: Root;
  let leftPs: number[];
  let rightPs: number[];

  function updateAst({ detail }: { detail: Root }) {
    mdast = detail;
  }
  function updateBlockPositions() {
    leftPs = [];
    rightPs = [];

    const scrollInfo = editor.getScrollInfo();
    const body = previewEl.querySelector<HTMLElement>('.markdown-body')!;

    let hasYaml = mdast.children[0]?.type === 'yaml';

    for (let i = 0; i < mdast.children.length; i++) {
      const node = mdast.children[i];

      // merge yaml and the second node
      if (hasYaml) {
        if (i === 0) {
          leftPs.push(0);
          rightPs.push(0);
          continue;
        }
        if (i === 1) {
          continue;
        }
      }

      const rightIndex = hasYaml ? i - 1 : i;
      const left =
        editor.heightAtLine(node.position!.start.line - 1, 'local') /
        (scrollInfo.height - scrollInfo.clientHeight);
      const right =
        ((body.children[rightIndex] as HTMLElement).offsetTop -
          body.offsetTop) /
        (previewEl.scrollHeight - previewEl.clientHeight);

      if (left >= 1 || right >= 1) {
        break;
      }

      leftPs.push(left);
      rightPs.push(right);

      if (node.type === 'footnoteDefinition') {
        // reach the last
        break;
      }
    }

    leftPs.push(1);
    rightPs.push(1);
    // console.log(leftPs, rightPs);
  }

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
      ...editorConfig,
    });

    // https://github.com/codemirror/CodeMirror/issues/2428#issuecomment-39315423
    editor.addKeyMap({
      'Shift-Tab': 'indentLess',
    });
    editor.setValue(value);
    editor.on('change', (doc, change) => {
      dispatch('change', { value: editor.getValue() });
    });

    // No need to call `on` because cm instance would change once after init
  });
  onDestroy(off);
</script>

<svelte:options immutable={true} />

<div
  class={`bytemd bytemd-mode-${mode}${fullscreen ? ' bytemd-fullscreen' : ''}`}
  bind:this={el}>
  <Toolbar
    {context}
    {mode}
    {activeTab}
    {plugins}
    {toolbar}
    {fullscreen}
    on:tab={setActiveTab}
    on:fullscreen={() => {
      fullscreen = !fullscreen;
    }} />
  <div class="bytemd-body">
    <div
      class="bytemd-editor"
      style={mode === 'tab' && activeTab === 1 ? 'display:none' : undefined}>
      <textarea bind:this={textarea} style="display:none" />
    </div>
    <div
      bind:this={previewEl}
      class="bytemd-preview"
      style={mode === 'tab' && activeTab === 0 ? 'display:none' : undefined}>
      <Viewer {...viewerProps} on:ast={updateAst} />
    </div>
  </div>
</div>
