<script>
  export let items;
</script>

{#each items as { type, value, tagName, children, properties: p }, i}
  {#if type === 'text'}
    {value}
  {:else if type === 'element'}
    {#if tagName === 'p'}
      <p align={p.align}>
        <svelte:self items={children} />
      </p>
    {:else if tagName === 'img'}
      <img src={p.src} alt={p.alt} width={p.width} height={p.height} />
    {:else if tagName === 'a'}
      <a href={p.href}>
        <svelte:self items={children} />
      </a>
    {/if}
  {/if}
{/each}
