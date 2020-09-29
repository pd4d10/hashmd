<script lang="ts">
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
  export let containerStyle: EditorProps['containerStyle'];

  let el: HTMLElement;
  let viewerProps: ViewerProps = {
    value,
    plugins,
    sanitize,
  };
  let textarea: HTMLTextAreaElement;
  let cm: CodeMirror.Editor;
  let activeTab = 0;

  let cbs: ReturnType<NonNullable<BytemdPlugin['editorEffect']>>[] = [];
  const dispatch = createEventDispatcher();

  // @ts-ignore
  function setActiveTab(e) {
    activeTab = e.detail.value;
    if (cm && activeTab === 0) {
      tick().then(() => {
        cm.focus();
      });
    }
  }

  function on() {
    cbs = (plugins ?? []).map(
      ({ editorEffect }) => editorEffect && editorEffect(cm, el)
    );
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

  $: if (cm && value !== cm.getValue()) {
    cm.setValue(value);
  }
  $: if (value != null) updateViewerValue();

  $: if (cm && el && plugins) {
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

    cm = codemirror.fromTextArea(textarea, {
      mode: 'yaml-frontmatter',
      lineWrapping: true,
      placeholder: 'Start writing...',
    });

    // https://github.com/codemirror/CodeMirror/issues/2428#issuecomment-39315423
    cm.addKeyMap({
      'Shift-Tab': 'indentLess',
    });
    cm.setValue(value);
    cm.on('change', (doc, change) => {
      dispatch('change', { value: cm.getValue() });
    });
    // No need to call `on` because cm instance would change once after init
  });
  onDestroy(off);
</script>

<svelte:options immutable={true} />

<div class="bytemd" bind:this={el} style={containerStyle}>
  <Toolbar {cm} {mode} {activeTab} {plugins} on:tab={setActiveTab} />
  <div class="bytemd-body">
    <div
      class="bytemd-editor"
      style={mode === 'tab' && activeTab === 1 ? 'display:none' : undefined}>
      <textarea bind:this={textarea} style="display:none" />
    </div>
    <div
      class="bytemd-preview"
      style={mode === 'tab' && activeTab === 0 ? 'display:none' : undefined}>
      <Viewer {...viewerProps} />
    </div>
  </div>
</div>
