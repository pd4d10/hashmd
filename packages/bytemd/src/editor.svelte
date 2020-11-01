<script lang="ts">
  import type { Editor } from 'codemirror';
  import type {} from 'codemirror/addon/display/placeholder';
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

  function on() {
    cbs = (plugins ?? []).map((p) => p.editorEffect?.(context));
  }
  function off() {
    cbs.forEach((cb) => cb && cb());
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

    // Scroll sync
    editor.on('scroll', () => {
      requestAnimationFrame(() => {
        const editorInfo = editor.getScrollInfo();
        const ratio =
          editorInfo.top / (editorInfo.height - editorInfo.clientHeight);
        previewEl.scrollTo(
          0,
          ratio * (previewEl.scrollHeight - previewEl.clientHeight)
        );
      });
    });

    // No need to call `on` because cm instance would change once after init
  });
  onDestroy(off);
</script>

<svelte:options immutable={true} />

<div class={`bytemd bytemd-mode-${mode}`} bind:this={el}>
  <Toolbar
    {context}
    {mode}
    {activeTab}
    {plugins}
    {toolbar}
    on:tab={setActiveTab} />
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
      <Viewer {...viewerProps} />
    </div>
  </div>
</div>
