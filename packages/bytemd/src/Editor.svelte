<script>
  import { onMount } from 'svelte';
  import codemirror from 'codemirror';
  import 'codemirror/mode/markdown/markdown.js';
  import Toolbar from './Toolbar.svelte';
  import Viewer from './Viewer.svelte';
  import { dataUrlFileHandler } from './editor.js'

  export let value;
  export let onChange = () => {};
  export let fileHandler = dataUrlFileHandler;
  export let plugins = [];

  let textarea;
  let cm;

  onMount(() => {
    cm = codemirror.fromTextArea(textarea, {
      mode: 'markdown',
      lineNumbers: true,
      lineWrapping: true,
    });
    cm.setValue(value);
    cm.on('change', () => {
      value = cm.getValue();
      onChange(value);
    });
  });
</script>

<style>
  .bytemd {
    border: 1px solid #eee;
  }
  .bytemd-body {
    display: flex;
    height: 300px;
  }
  .bytemd-body :global(.CodeMirror) {
    flex: 1;
    height: 100%;
  }
  .bytemd-viewer {
    padding: 20px;
    flex: 1;
    overflow: auto;
    border-left: 1px solid #eee;
  }
</style>

<div class="bytemd">
  <Toolbar {cm} {fileHandler} />
  <div class="bytemd-body">
    <textarea bind:this={textarea} />
    <div class="bytemd-viewer">
      <Viewer {value} {plugins} />
    </div>
  </div>
</div>
