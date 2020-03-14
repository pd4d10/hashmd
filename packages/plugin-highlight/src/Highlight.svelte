<script>
  import c from 'classnames'
  import Elements from './Element.svelte'
  export let node
</script>

<code class={c(node.properties.className)}>
  <Elements children={node.children} />
</code>
