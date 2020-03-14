<script>
  import katex from 'katex';

  export let node;

  $: isDisplay = node.properties.className.includes('math-display')
  $: value = node.children && node.children[0] && node.children[0].value
</script>

{#if isDisplay}
  <p>{@html katex.renderToString(value, {
    displayMode: true,
    throwOnError: false
  })}</p>
{:else}
  {@html katex.renderToString(value, { throwOnError: false })}
{/if}
