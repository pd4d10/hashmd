<script>
  import { onMount } from 'svelte'
  import abcjs from 'abcjs'

  const id = 'abc-' + Date.now()

  export let node

  $: value = node.children[0] && node.children[0].value
  $: if (value) {
    abcjs.renderAbc(id, value)
  }

  onMount(() => {
    if (value) {
      abcjs.renderAbc(id, value)
    }
  })
</script>

<style>
  div {
    text-align: center;
  }
</style>

<div {id}></div>
