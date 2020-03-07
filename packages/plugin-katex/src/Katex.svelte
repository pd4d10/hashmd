<script>
  import katex from 'katex';

  export let type;
  export let value
</script>

{#if type === 'math'}
  <p>{@html katex.renderToString(value, {
    displayMode: true,
    throwOnError: false
  })}</p>
{:else if type === 'inlineMath'}
  {@html katex.renderToString(value, { throwOnError: false })}
{/if}
