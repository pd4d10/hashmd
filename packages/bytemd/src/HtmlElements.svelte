<script>
  import HtmlElement from './HtmlElement.svelte'
  export let nodes;
  export let plugins;

  $: findPlugin = (node) => {
    return plugins.find(p => p.shouldTransformHtmlElement && p.shouldTransformHtmlElement(node))
  }
</script>

{#each nodes as node}
  {#if findPlugin(node)}
    <svelte:component this={findPlugin(node).component} {...node}></svelte:component>
  {:else}
    <HtmlElement {node} {plugins} />
  {/if}
{/each}
