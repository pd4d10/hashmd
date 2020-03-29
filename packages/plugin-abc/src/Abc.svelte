<script>
  import { onMount } from 'svelte';
  import abcjs from 'abcjs';

  const id = 'abc-' + Date.now();

  export let value;
  $: if (value) {
    abcjs.renderAbc(id, value);
  }

  onMount(() => {
    if (value) {
      abcjs.renderAbc(id, value);
    }
  });
</script>

<style>
  div {
    text-align: center;
  }
</style>

<div {id} />
