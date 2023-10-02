import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('bytemd-editor')
export class Editor extends LitElement {
  static styles = css``

  @property({ attribute: true })
  value = ''

  @property()
  render() {
    return html`<bytemd-viewer value=${this.value}></bytemd-viewer>`
  }
}
