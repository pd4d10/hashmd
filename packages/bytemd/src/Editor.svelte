<script>
  import { onMount } from 'svelte';
  import codemirror from 'codemirror';
  import 'codemirror/mode/markdown/markdown.js';
  import Toolbar from './Toolbar.svelte';
  import Viewer from './Viewer.svelte';
  import { dataUrlFileHandler } from './editor.js'

  export let source;
  export let onChange = () => {};
  export let fileHandler = dataUrlFileHandler;
  export let plugins = [];

  let textarea;
  let cm;

  onMount(() => {
    cm = codemirror.fromTextArea(textarea, {
      mode: 'markdown',
      // lineNumbers: true,
      lineWrapping: true,
    });
    cm.setValue(source);
    cm.on('change', () => {
      source = cm.getValue();
      onChange(source);
    });
  });
</script>

<style>
  .bytemd-body {
    display: flex;
    height: 300px;
    border: 1px solid #eee;
  }
  .bytemd-viewer {
    padding: 20px;
    flex: 1;
    overflow: auto;
    border-left: 1px solid #eee;
  }
  :global(.CodeMirror) {
    flex: 1;
    height: 100%;
  }
</style>

<Toolbar {cm} {fileHandler} />
<div class="bytemd-body">
  <textarea bind:this={textarea} />
  <div class="bytemd-viewer">
    <Viewer {source} {plugins} />
  </div>
</div>
