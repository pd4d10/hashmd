<script>
  import Elements from './Element.svelte'
  export let node
</script>

<code class={node.properties.className.join(' ')}>
  <Elements children={node.children} />
</code>
