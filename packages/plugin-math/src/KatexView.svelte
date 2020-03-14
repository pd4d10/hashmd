<script>
  import katex from 'katex';

  export let properties;
  export let children;

  $: isDisplay = properties.className.includes('math-display')
  $: value = children && children[0] && children[0].value
</script>

{#if isDisplay}
  <p>{@html katex.renderToString(value, {
    displayMode: true,
    throwOnError: false
  })}</p>
{:else}
  {@html katex.renderToString(value, { throwOnError: false })}
{/if}
