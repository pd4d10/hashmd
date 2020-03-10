<script>
  import katex from 'katex';

  export let node
</script>

{#if node.type === 'math'}
  <p>{@html katex.renderToString(node.value, {
    displayMode: true,
    throwOnError: false
  })}</p>
{:else if node.type === 'inlineMath'}
  {@html katex.renderToString(node.value, { throwOnError: false })}
{/if}
