<script>
  import { onMount } from 'svelte';
  import codemirror from 'codemirror';
  import mdMode from 'codemirror/mode/markdown/markdown.js';
  import Viewer from './Viewer.svelte';

  window.process = { cwd: () => '/' }; // FIXME:
  export let source;
  let textarea;

  onMount(() => {
    const ed = codemirror.fromTextArea(textarea, {
      mode: 'markdown'
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
