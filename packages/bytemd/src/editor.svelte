<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';
  import { dataUrlFileHandler, initEditor } from './utils';

  export let value = '';
  export let containerStyle;
  export let fileHandler = dataUrlFileHandler;
  export let plugins = [];
  export let mode = 'split';
  export let editorConfig;

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

  onMount(() => {
    initEditor(textarea, editorConfig, value, viewer, fileHandler, dispatch);
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
  .bytemd-editor :global(.CodeMirror) {
    height: 100%;
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
  <Toolbar
    {cm}
    {fileHandler}
    {plugins}
    {mode}
    {activeTab}
    on:tab={setActiveTab} />
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
