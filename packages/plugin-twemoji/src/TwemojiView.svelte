<script>
  import twemoji from 'twemoji'
  export let node
</script>

{@html twemoji.parse(node.value)}
