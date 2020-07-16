<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import mermaid from '@bytemd/plugin-mermaid';
  import footnotes from '@bytemd/plugin-footnotes';
  import imageViewer from '@bytemd/plugin-image-viewer';
  import imageUpload from '@bytemd/plugin-image-upload';
  import scrollSync from '@bytemd/plugin-scroll-sync';

  import 'github-markdown-css';
  import 'highlight.js/styles/vs.css';
  import 'katex/dist/katex.css';
  import '@bytemd/plugin-image-viewer/dist/index.css';

  let value = '';

  function handleChange(e) {
    value = e.detail.value;
  }

  onMount(async () => {
    const res = await fetch('demo.md');
    const text = await res.text();
    value = text;
  });

  let enabled = {
    highlight: true,
    math: true,
    mermaid: true,
    footnotes: true,
    imageViewer: true,
    imageUpload: true,
    scrollSync: true,
  };

  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        resolve(e.target.result);
      });
      reader.addEventListener('error', (e) => {
        reject(new Error('readAsDataURL error'));
      });
      reader.readAsDataURL(file);
    });
  }

  $: plugins = [
    enabled.mermaid && mermaid(),
    enabled.highlight && highlight(),
    enabled.math && math(),
    enabled.footnotes && footnotes(),
    enabled.imageViewer && imageViewer(),
    enabled.imageUpload && imageUpload(toDataUrl),
    enabled.scrollSync && scrollSync(),
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
  {#each Object.keys(enabled) as p}
    {' '}
    <label>
      <input type="checkbox" bind:checked={enabled[p]} />
      {p}
    </label>
  {/each}
</div>
<Editor {value} {plugins} on:change={handleChange} />
