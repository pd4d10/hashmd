<script context="module">
  // Declare callbacks here to be non-reactive
  const cbsMap = {};
</script>

<script>
  import { onMount, createEventDispatcher, onDestroy, tick } from 'svelte';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';
  import { initEditor } from './editor';

  export let value = '';
  export let markdownOptions = [];
  export let plugins = [];
  export let mode = 'split';
  export let editorConfig = {};
  export let toolbarItems = [];
  export let previewDebounce = 300;

  let textarea;
  let viewer;
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
      ({ editorEffect }) => editorEffect && editorEffect(cm)
    );
  }
  function off() {
    cbsMap[id] && cbsMap[id].forEach((cb) => cb && cb());
  }

  $: if (cm && value !== cm.getValue()) {
    cm.setValue(value);
  }
  $: if (cm && plugins) {
    off();
    tick().then(() => {
      on();
    });
  }
  onMount(async () => {
    cm = await initEditor(
      textarea,
      editorConfig,
      value,
      viewer,
      dispatch,
      previewDebounce
    );
    on();
  });
  onDestroy(() => {
    off();
  });
</script>

<style>
  /* This cannot be global, because CodeMirror seems use textarea's style to determine initialization status */
  .bytemd-editor textarea {
    display: none;
  }
</style>

<div class="bytemd">
  <Toolbar {cm} {toolbarItems} {mode} {activeTab} on:tab={setActiveTab} />
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
