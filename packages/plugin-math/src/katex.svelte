<script>
  import katex from 'katex';
  export let text;
  export let displayMode;
</script>

<!-- Note: a wrapper(div or span) is necessary to make elements keep in order -->
{#if displayMode}
  <div class="math math-display">
    {@html katex.renderToString(text, {
      displayMode: true,
      throwOnError: false,
    })}
  </div>
{:else}
  <span class="math math-inline">
    {@html katex.renderToString(text, { throwOnError: false })}
  </span>
{/if}
