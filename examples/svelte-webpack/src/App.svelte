<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import mermaid from '@bytemd/plugin-mermaid';
  import 'github-markdown-css';
  import 'highlight.js/styles/vs.css';
  import 'katex/dist/katex.css';

  let value = '';

  function handleChange(e) {
    value = e.detail.value;
  }

  onMount(async () => {
    const res = await fetch(
      'https://raw.githubusercontent.com/bytedance/bytemd/master/assets/demo.md'
    );
    const text = await res.text();
    value = text;
  });

  let enabled = {
    highlight: true,
    math: true,
    mermaid: true,
  };

  $: plugins = [
    enabled.mermaid && mermaid(),
    enabled.highlight && highlight(),
    enabled.math && math(),
  ].filter((x) => x);
</script>

<style>
  div {
    padding: 10px 0;
  }
  :global(.bytemd) {
    height: 90vh !important;
  }
</style>

<div>
  Plugins:
  {#each ['math', 'highlight', 'mermaid'] as p}
    {' '}
    <label>
      <input type="checkbox" bind:checked={enabled[p]} />
      {p}
    </label>
  {/each}
</div>
<Editor {value} {plugins} on:change={handleChange} />
