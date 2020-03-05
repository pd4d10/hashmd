<script>
  import { onMount } from 'svelte';
  import { Editor } from '@bytemd/core';
  let source = '';

  onMount(async () => {
    const res = await fetch('/fixture.md');
    source = await res.text();
  });
</script>

<style>

</style>

<Editor {source} />
