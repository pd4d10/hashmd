<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  import gfm from '@bytemd/plugin-gfm';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import mermaid from '@bytemd/plugin-mermaid';
  import footnotes from '@bytemd/plugin-footnotes';
  import importImage from '@bytemd/plugin-import-image';
  import frontmatter from '@bytemd/plugin-frontmatter';
  import mediumZoom from '@bytemd/plugin-medium-zoom';
  import importHtml from '@bytemd/plugin-import-html';

  import 'bytemd/dist/index.css';
  import 'github-markdown-css';
  import 'highlight.js/styles/vs.css';
  import 'katex/dist/katex.css';

  let value = '';
  let mode = 'split';

  function handleChange(e) {
    value = e.detail.value;
  }

  onMount(async () => {
    const res = await fetch(
      'https://raw.githubusercontent.com/bytedance/bytemd/main/packages/bytemd/README.md'
    );
    const text = await res.text();
    value = text;
  });

  let enabled = {
    breaks: false,
    gfm: true,
    highlight: true,
    math: true,
    mermaid: true,
    footnotes: true,
    'import-image': true,
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
    enabled.gfm && gfm(),
    enabled.mermaid && mermaid(),
    enabled.highlight && highlight(),
    enabled.math && math(),
    enabled.footnotes && footnotes(),
    enabled['import-image'] &&
      importImage({
        upload(files) {
          return Promise.all(files.map((file) => toDataUrl(file)));
        },
      }),
    frontmatter(),
    importHtml(),
    mediumZoom(),

    // For test:
    // {
    //   editorEffect(cm, el) {
    //     console.log('on', cm, el);
    //     return () => {
    //       console.log('off', cm, el);
    //     };
    //   },
    //   viewerEffect(el, result) {
    //     console.log('on', el, result);
    //     return () => {
    //       console.log('off', el, result);
    //     };
    //   },
    // },
  ].filter((x) => x);
</script>

<style>
  .container {
    max-width: 1280px;
    margin: 0 auto;
  }
  .line {
    margin: 10px 0;
    text-align: center;
  }
  :global(.bytemd-body) {
    height: calc(100vh - 140px);
  }
</style>

<div class="container">
  <div class="line">
    Mode:
    {#each ['split', 'tab'] as m}
      <label> <input type="radio" bind:group={mode} value={m} /> {m} </label>
    {/each}
  </div>
  <div class="line">
    Plugins:
    {#each Object.keys(enabled) as p}
      {' '}
      <label> <input type="checkbox" bind:checked={enabled[p]} /> {p} </label>
    {/each}
  </div>
  <Editor {value} {mode} {plugins} on:change={handleChange} />
</div>
