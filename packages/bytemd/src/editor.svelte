<svelte:options immutable={true} />

<script lang="ts">
  import type { Editor } from 'codemirror';
  import type { BytemdPlugin, EditorProps, ViewerProps } from './types';
  import { onMount, createEventDispatcher, onDestroy, tick } from 'svelte';
  import { debounce } from 'lodash-es';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';
  import { createUtils } from './editor';
  import { scrollSync } from './plugins';
  import Status from './status.svelte';

  export let value: EditorProps['value'] = '';
  export let plugins: NonNullable<EditorProps['plugins']> = [];
  export let sanitize: EditorProps['sanitize'];
  export let mode: EditorProps['mode'] = 'split';
  export let previewDebounce: NonNullable<EditorProps['previewDebounce']> = 300;
  export let placeholder: EditorProps['placeholder'];
  export let editorConfig: EditorProps['editorConfig'];

  let scrollSyncInstance = scrollSync();

  $: fullPlugins = (() => {
    const ps = [...plugins];
    if (mode === 'split' && scrollSyncEnabled) {
      ps.push(scrollSyncInstance);
    }
    return ps;
  })();

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
  let scrollSyncEnabled = true;

  $: context = { editor, $el: el, utils: createUtils(editor) };

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
    // console.log('on', fullPlugins);
    cbs = fullPlugins.map((p) => p.editorEffect?.(context));
  }
  function off() {
    // console.log('off', fullPlugins);
    cbs.forEach((cb) => cb && cb());
  }

  const updateViewerValue = debounce(() => {
    viewerProps = {
      value,
      plugins: fullPlugins,
      sanitize,
    };
  }, previewDebounce);

  $: if (editor && value !== editor.getValue()) {
    editor.setValue(value);
  }
  $: if (value != null) updateViewerValue();

  $: if (editor && el && fullPlugins) {
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
      placeholder,
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

<div
  class={`bytemd bytemd-mode-${mode}${fullscreen ? ' bytemd-fullscreen' : ''}`}
  bind:this={el}
>
  <Toolbar
    {context}
    {mode}
    {activeTab}
    {plugins}
    {fullscreen}
    on:tab={setActiveTab}
    on:fullscreen={() => {
      fullscreen = !fullscreen;
    }}
  />
  <div class="bytemd-body">
    <div
      class="bytemd-editor"
      style={mode === 'tab' && activeTab === 1 ? 'display:none' : undefined}
    >
      <textarea bind:this={textarea} style="display:none" />
    </div>
    <div
      bind:this={previewEl}
      class="bytemd-preview"
      style={mode === 'tab' && activeTab === 0 ? 'display:none' : undefined}
    >
      <Viewer
        value={viewerProps.value}
        plugins={viewerProps.plugins}
        sanitize={viewerProps.sanitize}
      />
    </div>
  </div>
  <Status
    scrollVisible={mode === 'split'}
    {value}
    {scrollSyncEnabled}
    on:sync={(e) => {
      scrollSyncEnabled = e.detail;
    }}
    on:top={() => {
      previewEl.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  />
</div>
