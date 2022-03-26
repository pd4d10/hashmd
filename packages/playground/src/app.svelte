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
  import markdownText from './text.md?raw'

  import 'highlight.js/styles/vs.css'
  import 'github-markdown-css' // placed after highlight styles to override `code` padding
  import 'katex/dist/katex.css'

  function stripPrefixes(obj: Record<string, any>) {
    return Object.entries(obj).reduce((p, [key, value]) => {
      p[key.split('/').slice(-1)[0].replace('.json', '')] = value
      // console.log(p)
      return p
    }, {} as Record<string, any>)
  }

  const locales = stripPrefixes(
    import.meta.globEager('/node_modules/bytemd/locales/*.json')
  )
  const gfmLocales = stripPrefixes(
    import.meta.globEager('/node_modules/@bytemd/plugin-gfm/locales/*.json')
  )
  const mathLocales = stripPrefixes(
    import.meta.globEager('/node_modules/@bytemd/plugin-math/locales/*.json')
  )
  const mermaidLocales = stripPrefixes(
    import.meta.globEager('/node_modules/@bytemd/plugin-mermaid/locales/*.json')
  )

  let value = markdownText
  let mode = 'auto'
  let localeKey = 'en'
  let maxLength: number

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
    enabled.breaks && breaks(),
    enabled.footnotes && footnotes(),
    enabled.frontmatter && frontmatter(),
    enabled.gemoji && gemoji(),
    enabled.gfm &&
      gfm({
        locale: gfmLocales[localeKey],
      }),
    enabled.highlight && highlight(),
    enabled.math &&
      math({
        locale: mathLocales[localeKey],
        katexOptions: { output: 'html' }, // https://github.com/KaTeX/KaTeX/issues/2796
      }),
    enabled['medium-zoom'] && mediumZoom(),
    enabled.mermaid &&
      mermaid({
        locale: mermaidLocales[localeKey],
      }),
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
      {#each Object.keys(locales) as l}
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
    locale={locales[localeKey]}
    uploadImages={(files) => {
      return Promise.all(
        files.map((file) => {
          // TODO:
          return {
            url: 'https://picsum.photos/300',
          }
        })
      )
    }}
    on:change={(e) => {
      value = e.detail.value
    }}
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
