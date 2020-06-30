<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';
  import { dataUrlFileHandler, initEditor } from './editor';

  export let value = '';
  export let markdownOptions = [];
  export let plugins = [];
  export let containerStyle;
  export let fileHandler = dataUrlFileHandler;
  export let mode = 'split';
  export let editorConfig;
  export let toolbarItems = [];
  export let debounceMs = 300;

  let textarea;
  let viewer;
  let cm;

  let activeTab = 0;
  function setActiveTab(e) {
    activeTab = e.detail.value;
  }

  $: if (cm && value !== cm.getValue()) {
    cm.setValue(value);
  }

  const dispatch = createEventDispatcher();

  onMount(async () => {
    cm = await initEditor(
      textarea,
      editorConfig,
      value,
      viewer,
      fileHandler,
      dispatch,
      debounceMs
    );
    dispatch('mount', { cm });
  });
</script>

<style>
  /* This cannot be global, because CodeMirror seems use textarea's style to determine initialization status */
  .bytemd-editor textarea {
    display: none;
  }
</style>

<div class="bytemd" style={containerStyle}>
  <Toolbar
    {cm}
    {fileHandler}
    {toolbarItems}
    {mode}
    {activeTab}
    on:tab={setActiveTab} />
  <div class="bytemd-body">
    <div
      class="bytemd-editor"
      style={mode === 'tab' && activeTab === 1 ? 'display:none' : undefined}>
      <textarea bind:this={textarea} />
    </div>
    <div
      class="bytemd-preview"
      bind:this={viewer}
      style={mode === 'tab' && activeTab === 0 ? 'display:none' : undefined}>
      <Viewer {value} {markdownOptions} {plugins} />
    </div>
  </div>
</div>
