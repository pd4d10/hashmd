<script>
  import hljs from 'highlight.js';

  export let node
  $: lang = node.lang // TODO:
  $: value = node.children[0] && node.children[0].value || ''
</script>

<pre>{@html hljs.highlight(lang, value).value}</pre>
