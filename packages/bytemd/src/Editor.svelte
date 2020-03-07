<script>
  import { onMount } from 'svelte';
  import codemirror from 'codemirror';
  import 'codemirror/mode/markdown/markdown.js';
  import Toolbar from './Toolbar.svelte';
  import Viewer from './Viewer.svelte';

  export let source;
  export let codemirrorConfig;
  export let plugins = [];

  let textarea;
  let cm;

  onMount(() => {
    cm = codemirror.fromTextArea(textarea, {
      mode: 'markdown',
      lineNumbers: true,
      lineWrapping: true,
      ...codemirrorConfig
    });
    cm.setValue(source);
    cm.on('change', () => {
      source = cm.getValue();
    });
  });
</script>

<style>
  .bytemd-container {
    display: flex;
    height: 300px;
  }
  .bytemd-viewer {
    padding: 20px;
    flex: 1;
    overflow: auto;
  }
  :global(.CodeMirror) {
    flex: 1;
    height: 100%;
  }
</style>

<Toolbar {cm} />
<div class="bytemd-container">
  <textarea bind:this={textarea} />
  <div class="bytemd-viewer">
    <Viewer {source} {plugins} />
  </div>
</div>
