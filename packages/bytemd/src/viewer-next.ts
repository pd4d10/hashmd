import { BytemdPlugin, ViewerProps } from './types'
import { getProcessor } from './utils'
import type { Root } from 'hast'
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import type { Plugin } from 'unified'
import type { VFile } from 'vfile'

@customElement('bytemd-viewer')
export class Viewer extends LitElement {
  @property({ attribute: true }) value: ViewerProps['value'] = ''
  @property() plugins: ViewerProps['plugins']
  @property() sanitize: ViewerProps['sanitize']
  @property() remarkRehype: ViewerProps['remarkRehype']

  protected firstUpdated() {
    this.renderRoot.addEventListener('click', (e) => {
      const $ = e.target as HTMLElement
      if ($.tagName === 'A') {
        const href = $.getAttribute('href')
        if (href?.startsWith('#')) {
          this.querySelector('#user-content-' + href.slice(1))?.scrollIntoView()
        }
      }
    })
  }

  render() {
    const dispatchPlugin: BytemdPlugin = {
      rehype: (processor) =>
        processor.use<any>(() => (tree, file) => {
          // console.log(tree, file)
          this.dispatchEvent(
            new CustomEvent('info', { detail: { hast: tree, file } }),
          )
        }),
    }

    const { value, plugins = [], sanitize, remarkRehype } = this
    const rawHtml = getProcessor({
      plugins: [...plugins, dispatchPlugin],
      sanitize,
      remarkRehype,
    })
      .processSync(value)
      .toString()

    return html`${unsafeHTML(rawHtml)}`
  }
}
