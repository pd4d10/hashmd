<script>
  import { onMount } from 'svelte'
  import abcjs from 'abcjs'
  import nanoid from 'nanoid'

  const id = 'abc-' + nanoid()

  export let children

  $: value = children && children[0] && children[0].value
  $: if (value) {
    abcjs.renderAbc(id, value)
  }

  onMount(() => {
    abcjs.renderAbc(id, value)
  })
</script>

<style>
  div {
    text-align: center;
  }
</style>

<div {id}></div>
