<script lang="ts">
  import { Editor } from 'bytemd'
  import breaks from '@bytemd/plugin-breaks'
  import footnotes from '@bytemd/plugin-footnotes'
  import frontmatter from '@bytemd/plugin-frontmatter'
  import gfm from '@bytemd/plugin-gfm'
  import highlight from '@bytemd/plugin-highlight'
  import math from '@bytemd/plugin-math'
  import mediumZoom from '@bytemd/plugin-medium-zoom'
  import mermaid from '@bytemd/plugin-mermaid'
  import gemoji from '@bytemd/plugin-gemoji'
  import { markdownText } from '@bytemd/example-utils'

  import 'bytemd/dist/index.css'
  import 'github-markdown-css'
  import 'highlight.js/styles/vs.css'
  import 'katex/dist/katex.css'

  // importing from node_modules isn't supported yet,
  // import from the source instead
  // https://github.com/vitejs/vite/issues/1903
  const _localeMap = import.meta.globEager(
    '../../../../packages/*/src/locales/*.json'
  )
  let localeMap: Record<string, Record<string, any>> = {}
  Object.entries(_localeMap).forEach(([key, value]) => {
    const [name, locale] = key
      .replace('../../../../packages/', '')
      .replace(/\/src\/locales\//, '/')
      .replace(/\.json$/, '')
      .split('/')

    if (!localeMap[locale]) localeMap[locale] = {}
    localeMap[locale][name] = value
  })

  // console.log(localeMap)

  let value = markdownText
  let mode = 'auto'
  let localeKey = 'en'
  let maxLength

  $: currentLocale = localeMap[localeKey]

  function handleChange(e) {
    value = e.detail.value
  }

  function uploadImages(files) {
    return Promise.all(
      files.map((file) => {
        // TODO:
        return {
          url: 'https://picsum.photos/300',
        }
      })
    )
  }

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
  }

  $: plugins = [
    // {
    //   remark: (p) => p.use(lintConsistent),
    //   viewerEffect(ctx) {
    //     console.log(ctx.file.messages);
    //   },
    // },
    enabled.breaks && breaks(),
    enabled.footnotes && footnotes(),
    enabled.frontmatter && frontmatter(),
    enabled.gemoji && gemoji(),
    enabled.gfm && gfm({ locale: currentLocale['plugin-gfm'] }),
    enabled.highlight && highlight(),
    enabled.math &&
      math({
        locale: currentLocale['plugin-math'],
        katexOptions: { output: 'html' }, // https://github.com/KaTeX/KaTeX/issues/2796
      }),
    enabled['medium-zoom'] && mediumZoom(),
    enabled.mermaid && mermaid({ locale: currentLocale['plugin-mermaid'] }),
  ].filter((x) => x)
</script>

<div class="container">
  <div class="line">
    Mode:
    {#each ['auto', 'split', 'tab'] as m}
      <label> <input type="radio" bind:group={mode} value={m} />{m}</label>
    {/each}
    , Locale:
    <select bind:value={localeKey}>
      {#each Object.keys(localeMap) as l}
        <option value={l}>{l}</option>
      {/each}
    </select>
    , Max length:
    <input bind:value={maxLength} type="number" />
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
    {maxLength}
    placeholder={'Start writing with ByteMD'}
    locale={{}}
    {uploadImages}
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
