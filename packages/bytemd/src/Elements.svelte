<script>
  import Element from './Element.svelte';

  export let nodes;
  export let plugins;
</script>

{#each nodes as node}
  <Element {node} {plugins} plugin={plugins.find(p => p.shouldTransformElement(node))} />
{/each}
