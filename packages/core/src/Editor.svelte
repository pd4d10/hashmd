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
  div {
    display: flex;
    height: 100vh;
  }
</style>

<Toolbar {cm} />
<div>
  <textarea bind:this={textarea} />
  <Viewer {source} />
</div>
