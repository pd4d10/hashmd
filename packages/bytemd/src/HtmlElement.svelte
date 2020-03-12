<script>
  import HtmlElements from './HtmlElements.svelte'
  export let node
  export let plugins
</script>

{#if node.type === 'text'}
  {node.value}
{:else if node.type === 'element'}
  {#if node.tagName === 'p'}
    <p align={node.properties.align}><HtmlElements nodes={node.children} {plugins} /></p>
  {:else if node.tagName === 'img'}
    <img src={node.properties.src} alt={node.properties.alt} width={node.properties.width} height={node.properties.height} />
  {:else if node.tagName === 'a'}
    <a href={node.properties.href}><HtmlElements nodes={node.children} {plugins} /></a>
  {/if}
{/if}
