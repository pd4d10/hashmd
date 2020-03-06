<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  let source = '```javascript\nconst x = 1\n```';

  onMount(async () => {
    // const res = await fetch('/fixture.md');
    // source = await res.text();
  });
</script>

<Editor {source} />
