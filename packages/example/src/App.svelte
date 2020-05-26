<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import mermaid from '@bytemd/plugin-mermaid';
  import media from '@bytemd/plugin-media';
  import abc from '@bytemd/plugin-abc';
  import styledText from '@bytemd/plugin-styled-text';

  import demo from './demo.md';

  let value = demo;

  let enabled = {
    highlight: true,
    math: true,
    mermaid: true,
    media: true,
    abc: true,
    'styled-text': true,
  };

  $: plugins = [
    enabled.highlight && highlight(),
    enabled.math && math(),
    enabled.mermaid && mermaid(),
    enabled.media && media(),
    enabled.abc && abc(),
    enabled['styled-text'] && styledText(),
  ].filter((x) => x);

  function handleChange(e) {
    value = e.detail.value;
  }
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
  {#each ['math', 'mermaid', 'highlight', 'media', 'abc', 'styled-text'] as p}
    {' '}
    <label>
      <input type="checkbox" bind:checked={enabled[p]} />
      {p}
    </label>
  {/each}
</div>
<Editor {value} {plugins} on:change={handleChange} />
