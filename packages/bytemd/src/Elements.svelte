<script>
  import Element from './Element.svelte';

  export let nodes;
  export let plugins;

  $: findPlugin = (node) => {
    return plugins.find(p => p.test(node))
  }
</script>

{#each nodes as node}
  {#if findPlugin(node)}
    <svelte:component this={findPlugin(node).component} {...node} {...findPlugin(node).props} />
  {:else}
    <Element {node} {plugins} />
  {/if}
{/each}
