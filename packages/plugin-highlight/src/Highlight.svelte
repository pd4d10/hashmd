<script>
  import hljs from 'highlight.js';

  export let node
</script>

<pre>{@html hljs.highlight(node.lang, node.value).value}</pre>
