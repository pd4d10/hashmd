<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import mermaid from '@bytemd/plugin-mermaid';
  import footnotes from '@bytemd/plugin-footnotes';
  import imageUpload from '@bytemd/plugin-image-upload';
  import scrollSync from '@bytemd/plugin-scroll-sync';

  import 'github-markdown-css';
  import 'highlight.js/styles/vs.css';
  import 'katex/dist/katex.css';
  import '@bytemd/plugin-image-viewer/dist/index.css';

  let value = '';
  let mode = 'split';

  function handleChange(e) {
    value = e.detail.value;
  }

  onMount(async () => {
    const res = await fetch(
      'https://raw.githubusercontent.com/bytedance/bytemd/master/packages/bytemd/README.md'
    );
    const text = await res.text();
    value = text;
  });

  let enabled = {
    highlight: true,
    math: true,
    mermaid: true,
    footnotes: true,
    'image-upload': true,
    'scroll-sync': true,
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
    enabled['image-upload'] && imageUpload(toDataUrl),
    enabled['scroll-sync'] && scrollSync(),
    // {
    //   editorEffect(cm, el) {
    //     console.log('on', cm, el);
    //     return () => {
    //       console.log('off', cm, el);
    //     };
    //   },
    //   viewerEffect(el) {
    //     console.log('on', el);
    //     return () => {
    //       console.log('off', el);
    //     };
    //   },
    // },
  ].filter((x) => x);
</script>

<style>
  .line {
    margin: 10px 0;
  }
  :global(.bytemd) {
    height: calc(100vh - 100px);
  }
</style>

<div>
  <div class="line">
    Mode:
    {#each ['split', 'tab'] as m}
      <label>
        <input type="radio" bind:group={mode} value={m} />
        {m}
      </label>
    {/each}
  </div>
  <div class="line">
    Plugins:
    {#each Object.keys(enabled) as p}
      {' '}
      <label>
        <input type="checkbox" bind:checked={enabled[p]} />
        {p}
      </label>
    {/each}
  </div>
</div>
<Editor {value} {mode} {plugins} on:change={handleChange} />
