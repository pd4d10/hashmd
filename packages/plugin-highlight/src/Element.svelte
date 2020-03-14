<script>
  import c from 'classnames'
  export let children
</script>

{#each children as { type, value, tagName, properties, children }}
  {#if type === 'text'}
    {value}
  {:else if tagName === 'span'}
    <span class={c(properties.className)}><svelte:self {children} /></span>
  {/if}
{/each}
