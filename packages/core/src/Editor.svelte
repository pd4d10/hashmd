<script>
  import { onMount } from 'svelte';
  import codemirror from 'codemirror';
  import 'codemirror/mode/markdown/markdown.js';
  import Toolbar from './Toolbar.svelte';
  import Viewer from './Viewer.svelte';

  window.process = { cwd: () => '/' }; // FIXME:

  export let source;
  export let codemirrorConfig;

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
  .container {
    display: flex;
    height: 100vh;
  }
  .viewer {
    padding: 20px;
    flex: 1;
    overflow: auto;
  }
</style>

<Toolbar {cm} />
<div class="container">
  <textarea bind:this={textarea} />
  <div class="viewer">
    <Viewer {source} />
  </div>
</div>
