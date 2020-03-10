<script>
  import Viz from 'viz.js'
  import workerURL from 'viz.js/full.render.js';

  const viz = new Viz(workerURL)

  export let node
</script>

{#await viz.renderString(node.value)}
	<p>...</p>
{:then raw}
	{@html raw}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
