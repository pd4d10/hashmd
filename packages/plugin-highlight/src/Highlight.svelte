<script>
  import hljs from 'highlight.js';

  export let lang
  export let value
</script>

<pre>{@html hljs.highlight(lang, value).value}</pre>
