<script>
  import Viz from 'viz.js'
  import workerURL from 'viz.js/full.render.js';

  const viz = new Viz(workerURL)

  export let children
  $: value = children && children[0] && children[0].value
</script>

{#if value}
  {#await viz.renderString(value)}
    <p>...</p>
  {:then raw}
    {@html raw}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{/if}
