import { ViewerProps } from './types'
import { getProcessor } from './utils'
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

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
    const { value, plugins, sanitize, remarkRehype } = this
    const rawHtml = getProcessor({ plugins, sanitize, remarkRehype })
      .processSync(value)
      .toString()

    return html`${unsafeHTML(rawHtml)}`
  }
}
