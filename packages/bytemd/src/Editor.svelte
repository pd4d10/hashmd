<script>
  import Viewer from './Viewer.svelte';
  window.process = { cwd: () => '/' }; // FIXME:
  export let source;
</script>

<style>
  div {
    display: flex;
    height: 100vh;
  }
  textarea {
    flex: 1;
    font-size: 14px;
    padding: 10px;
  }
</style>

<div>
  <textarea cols="30" rows="10" bind:value={source} />
  <Viewer {source} />
</div>
