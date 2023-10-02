import { ViewerProps } from './types'
import { getProcessor } from './utils'
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

@customElement('bytemd-viewer')
export class Viewer extends LitElement {
  @property({ attribute: true })
  value: ViewerProps['value'] = ''

  @property()
  plugins: NonNullable<ViewerProps['plugins']> = []

  @property()
  sanitize: ViewerProps['sanitize'] = undefined

  @property()
  remarkRehype: ViewerProps['remarkRehype'] = undefined

  _onClick(e: MouseEvent) {
    const $ = e.target as HTMLElement
    if ($.tagName !== 'A') return

    const href = $.getAttribute('href')
    if (!href?.startsWith('#')) return

    this.shadowRoot
      ?.querySelector('#user-content-' + href.slice(1))
      ?.scrollIntoView()
  }

  render() {
    const { value, plugins, sanitize, remarkRehype, _onClick } = this
    const rawHtml = getProcessor({ plugins, sanitize, remarkRehype })
      .processSync(value)
      .toString()

    return html`<div class="markdown-body" @click=${_onClick}>
      ${unsafeHTML(rawHtml)}
    </div>`
  }
}
