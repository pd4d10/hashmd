<script>
  import { onMount } from 'svelte';
  import codemirror from 'codemirror';
  import 'codemirror/mode/markdown/markdown.js';
  import Viewer from './Viewer.svelte';

  window.process = { cwd: () => '/' }; // FIXME:

  export let source;
  export let codemirrorConfig;

  let textarea;

  onMount(() => {
    const ed = codemirror.fromTextArea(textarea, {
      mode: 'markdown',
      lineNumbers: true,
      lineWrapping: true,
      ...codemirrorConfig
    });
    ed.setValue(source);
    ed.on('change', () => {
      source = ed.getValue();
    });
  });
</script>

<style>
  div {
    display: flex;
    height: 100vh;
  }
</style>

<div>
  <textarea bind:this={textarea} />
  <Viewer {source} />
</div>
