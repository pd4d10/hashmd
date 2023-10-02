import markdownText from './text.md?raw'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import gemoji from '@bytemd/plugin-gemoji'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import 'bytemd'
import 'github-markdown-css'
import 'highlight.js/styles/vs.css'
// placed after highlight styles to override `code` padding
import 'katex/dist/katex.css'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

function stripPrefixes(obj: Record<string, any>) {
  return Object.entries(obj).reduce(
    (p, [key, value]) => {
      p[key.split('/').slice(-1)[0].replace('.json', '')] = value
      // console.log(p)
      return p
    },
    {} as Record<string, any>,
  )
}

const locales = stripPrefixes(
  import.meta.glob('/node_modules/bytemd/locales/*.json', { eager: true }),
)
const gfmLocales = stripPrefixes(
  import.meta.glob('/node_modules/@bytemd/plugin-gfm/locales/*.json', {
    eager: true,
  }),
)
const mathLocales = stripPrefixes(
  import.meta.glob('/node_modules/@bytemd/plugin-math/locales/*.json', {
    eager: true,
  }),
)
const mermaidLocales = stripPrefixes(
  import.meta.glob('/node_modules/@bytemd/plugin-mermaid/locales/*.json', {
    eager: true,
  }),
)

@customElement('my-element')
export class MyElement extends LitElement {
  @property()
  value = markdownText

  @property()
  mode = 'auto'

  @property()
  localeKey = 'en'

  @property()
  enabled = {
    breaks: false,
    frontmatter: true,
    gemoji: true,
    gfm: true,
    highlight: true,
    math: true,
    'medium-zoom': true,
    mermaid: true,
  }

  render() {
    const { value, mode, enabled, localeKey } = this
    const plugins = [
      enabled.breaks && breaks(),
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

    return html`
      <div class="container">
        <div class="line">
          Mode:
          ${['auto', 'split', 'tab'].map(
            (mode) =>
              html`<label> <input type="radio" value=${mode} />${mode}</label>`,
          )}
          , Locale:
          <select value=${localeKey}>
            ${Object.keys(locales).map(
              (locale) => html`<option value=${locale}>${locale}</option>`,
            )}
          </select>
        </div>
        <div class="line">
          Plugins:
          ${Object.keys(enabled).map(
            (p) =>
              html`<label
                ><input type="checkbox" checked=${enabled[p]} />${p}</label
              >`,
          )}
        </div>
        <bytemd-editor value=${value}></bytemd-editor>
      </div>
    `
  }

  static styles = css`
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
        Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
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
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
