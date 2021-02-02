<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  import gfm from '@bytemd/plugin-gfm';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import breaks from '@bytemd/plugin-breaks';
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
    const res = await fetch('/example.md');
    const text = await res.text();
    value = text;
  });

  let enabled = {
    breaks: false,
    gfm: true,
    highlight: true,
    math: true,
    mermaid: true,
    frontmatter: true,
    footnotes: true,
    'import-html': true,
    'import-image': true,
    'medium-zoom': true,
  };

  function toBlobUrl(file) {
    return URL.createObjectURL(file);
  }

  $: plugins = [
    enabled.breaks && breaks(),
    enabled.gfm && gfm(),
    enabled.highlight && highlight(),
    enabled.math && math(),
    enabled.mermaid && mermaid(),
    enabled.footnotes && footnotes(),
    enabled['import-image'] &&
      importImage({
        upload(files) {
          return Promise.all(files.map((file) => toBlobUrl(file)));
        },
      }),
    enabled.frontmatter && frontmatter(),
    enabled['import-html'] && importHtml(),
    enabled['medium-zoom'] && mediumZoom(),

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

  function sanitize(schema) {
    schema.protocols.src.push('blob');
    return schema;
  }
</script>

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
  <Editor {value} {mode} {plugins} {sanitize} on:change={handleChange} />
</div>

<style>
  .container {
    max-width: 1280px;
    margin: 0 auto;
  }
  .line {
    margin: 10px 0;
    text-align: center;
  }
  :global(body) {
    margin: 0 10px;
    font-size: 14px;
  }
  :global(.bytemd) {
    height: calc(100vh - 100px);
  }
  :global(.medium-zoom-overlay) {
    z-index: 100;
  }
  :global(.medium-zoom-image--opened) {
    z-index: 101;
  }
</style>
