<script>
  import Viz from 'viz.js';
  import workerURL from 'viz.js/full.render.js';

  const viz = new Viz(workerURL);

  export let value;
</script>

<style>
  div {
    text-align: center;
  }
</style>

<div>
  {#if value}
    {#await viz.renderString(value)}
      <p>...</p>
    {:then raw}
      {@html raw}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  {/if}
</div>
