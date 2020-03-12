<script>
  import HtmlElement from './HtmlElement.svelte'
  export let nodes;
</script>

{#each nodes as node}
  <HtmlElement {node} />
{/each}
