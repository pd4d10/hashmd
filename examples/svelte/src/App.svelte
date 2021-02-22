<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  import breaks from '@bytemd/plugin-breaks';
  import footnotes from '@bytemd/plugin-footnotes';
  import frontmatter from '@bytemd/plugin-frontmatter';
  import gfm from '@bytemd/plugin-gfm';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import mediumZoom from '@bytemd/plugin-medium-zoom';
  import mermaid from '@bytemd/plugin-mermaid';
  import gemoji from '@bytemd/plugin-gemoji';

  import en from 'bytemd/lib/locales/en-US';
  import zh from 'bytemd/lib/locales/zh-CN';
  import gfmEn from '@bytemd/plugin-gfm/lib/locales/en-US';
  import gfmZh from '@bytemd/plugin-gfm/lib/locales/zh-CN';
  import mathEn from '@bytemd/plugin-math/lib/locales/en-US';
  import mathZh from '@bytemd/plugin-math/lib/locales/zh-CN';
  import mermaidEn from '@bytemd/plugin-mermaid/lib/locales/en-US';
  import mermaidZh from '@bytemd/plugin-mermaid/lib/locales/zh-CN';

  const locales = {
    'en-US': { bytemd: en, gfm: gfmEn, math: mathEn, mermaid: mermaidEn },
    'zh-CN': { bytemd: zh, gfm: gfmZh, math: mathZh, mermaid: mermaidZh },
  };

  import 'bytemd/dist/index.css';
  import 'github-markdown-css';
  // import 'juejin-markdown-themes/dist/juejin.css';
  import 'highlight.js/styles/vs.css';
  import 'katex/dist/katex.css';
  // import 'normalize.css';

  let value = '';
  let mode = 'auto';
  let localeKey = 'en-US';

  $: currentLocale = locales[localeKey];

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
    footnotes: true,
    frontmatter: true,
    gemoji: true,
    gfm: true,
    highlight: true,
    math: true,
    'medium-zoom': true,
    mermaid: true,
  };

  $: plugins = [
    enabled.breaks && breaks(),
    enabled.footnotes && footnotes(),
    enabled.frontmatter && frontmatter(),
    enabled.gemoji && gemoji(),
    enabled.gfm && gfm({ locale: currentLocale.gfm }),
    enabled.highlight && highlight(),
    enabled.math && math({ locale: currentLocale.math }),
    enabled['medium-zoom'] && mediumZoom(),
    enabled.mermaid && mermaid({ locale: currentLocale.mermaid }),
  ].filter((x) => x);
</script>

<div class="container">
  <div class="line">
    Mode:
    {#each ['auto', 'split', 'tab'] as m}
      <label> <input type="radio" bind:group={mode} value={m} />{m}</label>
    {/each}
    , Locale:
    {#each Object.keys(locales) as l}
      <label> <input type="radio" bind:group={localeKey} value={l} />{l}</label>
    {/each}
  </div>
  <div class="line">
    Plugins:
    {#each Object.keys(enabled) as p}
      {' '}
      <label> <input type="checkbox" bind:checked={enabled[p]} />{p}</label>
    {/each}
  </div>
  <Editor
    {value}
    {mode}
    {plugins}
    placeholder={localeKey === 'en-US' ? 'Start writing' : '开始写作'}
    locale={currentLocale.bytemd}
    uploadImages={(files) => {
      return Promise.all(
        files.map((file) => {
          // TODO:
          return {
            src: 'https://picsum.photos/300',
          };
        })
      );
    }}
    on:change={handleChange}
  />
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .line {
    margin: 10px 0;
    text-align: center;
  }
  :global(body) {
    margin: 0 10px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
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
