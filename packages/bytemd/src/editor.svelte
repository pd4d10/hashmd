<script context="module">
  // Declare callbacks here to be non-reactive
  const cbsMap = {};
</script>

<script>
  import { onMount, createEventDispatcher, onDestroy, tick } from 'svelte';
  import debounce from 'lodash.debounce';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';

  export let value = '';
  export let markdownOptions = [];
  export let plugins = [];
  export let mode = 'split';
  export let editorConfig = {};
  export let toolbarItems = [];
  export let previewDebounce = 300;

  let el;
  let viewerValue;
  let textarea;
  let cm;
  let cbs = [];
  let activeTab = 0;
  const id = Date.now();
  const dispatch = createEventDispatcher();

  function setActiveTab(e) {
    activeTab = e.detail.value;
  }

  function on() {
    cbsMap[id] = plugins.map(
      ({ editorEffect }) => editorEffect && editorEffect(cm, el)
    );
  }
  function off() {
    cbsMap[id] && cbsMap[id].forEach((cb) => cb && cb());
  }
  const updateViewerValue = debounce(() => {
    viewerValue = value;
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
    const codemirror = await import('codemirror');
    await import('codemirror/mode/markdown/markdown.js');
    cm = codemirror.fromTextArea(textarea, {
      mode: 'markdown',
      lineWrapping: true,
      ...editorConfig,
    });
    cm.setValue(value);
    cm.on('change', (doc, change) => {
      dispatch('change', { value: cm.getValue() });
    });
    // No need to call `on` because cm instance would change once after init
  });
  onDestroy(off);
</script>

<style>
  /* This cannot be global, because CodeMirror seems use textarea's style to determine initialization status */
  .bytemd-editor textarea {
    display: none;
  }
</style>

<div class="bytemd" bind:this={el}>
  <Toolbar {cm} {toolbarItems} {mode} {activeTab} on:tab={setActiveTab} />
  <div class="bytemd-body">
    <div
      class="bytemd-editor"
      style={mode === 'tab' && activeTab === 1 ? 'display:none' : undefined}>
      <textarea bind:this={textarea} />
    </div>
    <div
      class="bytemd-preview"
      style={mode === 'tab' && activeTab === 0 ? 'display:none' : undefined}>
      <Viewer value={viewerValue} {markdownOptions} {plugins} />
    </div>
  </div>
</div>
