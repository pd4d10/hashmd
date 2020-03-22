<script>
  export let children
</script>

{#each children as { type, value, tagName, properties, children }}
  {#if type === 'text'}
    {value}
  {:else if tagName === 'span'}
    <span class={properties && properties.className && properties.className.join(' ')}><svelte:self {children} /></span>
  {/if}
{/each}
