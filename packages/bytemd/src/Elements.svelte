<script>
  import Element from './Element.svelte';

  export let nodes;
  export let plugins;

  $: findPlugin = (node) => {
    for (let i = 0; i < plugins.length; i++) {
      const res = plugins[i].render(node)
      if (res) return res
    }
  }
</script>

{#each nodes as node}
  {#if findPlugin(node)}
    <svelte:component this={findPlugin(node).component} {node} {...findPlugin(node).props} />
  {:else}
    <Element {node} {plugins} />
  {/if}
{/each}
