<script>
  import hljs from 'highlight.js';

  export let lang
  export let value
</script>

<pre>{#if hljs.getLanguage(lang)}
  {@html hljs.highlight(lang, value).value}
{:else}
  {value}
{/if}</pre>
