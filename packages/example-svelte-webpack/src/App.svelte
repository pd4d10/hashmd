<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  import remarkMath from 'remark-math';
  import rehypeKatex from 'rehype-katex';
  import rehypeHighlight from 'rehype-highlight';

  let value = '';

  function handleChange(e) {
    value = e.detail.value;
  }

  let plugins = [];

  onMount(async () => {
    const res = await fetch(
      'https://raw.githubusercontent.com/bytedance/bytemd/master/packages/example/src/demo.md'
    );
    const text = await res.text();
    value = text;
  });
</script>

<style>
  :global(.bytemd) {
    height: 90vh !important;
  }
</style>

<Editor
  {value}
  on:change={(v) => {
    value = v;
  }}
  {plugins}
  on:change={handleChange} />
