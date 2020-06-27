<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';
  import { dataUrlFileHandler, initEditor } from './editor';

  export let value = '';
  export let containerStyle;
  export let fileHandler = dataUrlFileHandler;
  export let plugins = [];
  export let mode = 'split';
  export let editorConfig;
  export let toolbar = true;
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
  });
</script>

<style>
  .bytemd {
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
  }
  .bytemd-body {
    flex-grow: 1;
    display: flex;
    overflow: auto;
  }
  .bytemd-editor {
    flex: 1;
    overflow: hidden;
    height: 100%;
  }
  .bytemd-editor textarea {
    display: none;
  }
  .bytemd-editor :global(.CodeMirror) {
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .bytemd-viewer {
    padding: 20px;
    flex: 1;
    overflow: auto;
    border-left: 1px solid #eee;
  }
  .hidden {
    display: none;
  }
</style>

<div class="bytemd" style={containerStyle}>
  {#if toolbar}
    <Toolbar
      {cm}
      {fileHandler}
      {toolbarItems}
      {mode}
      {activeTab}
      on:tab={setActiveTab} />
  {/if}
  <div class="bytemd-body">
    <div class="bytemd-editor" class:hidden={mode === 'tab' && activeTab === 1}>
      <textarea bind:this={textarea} />
    </div>
    <div
      class="bytemd-viewer"
      bind:this={viewer}
      class:hidden={mode === 'tab' && activeTab === 0}>
      <Viewer {value} {plugins} />
    </div>
  </div>
</div>
