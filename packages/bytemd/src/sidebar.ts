import { icons } from './icons'
import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

@customElement('bytemd-sidebar')
export class Sidebar extends LitElement {
  @property() visible = false

  protected render(): unknown {
    return html`<div
        class="close"
        @click=${() => {
          this.visible = false
        }}
      >
        ${unsafeHTML(icons.Close)}
      </div>
      <slot></slot>`
  }

  static styles = css`
    :host {
      /* height: 100%; */
      /* overflow: auto; */
      font-size: 16px;
      border-left: 1px solid var(--border-color);
      position: relative;
      padding: 0 16px;
    }
    .close {
      position: absolute;
      padding: 16px;
      top: 0;
      right: 0;
      cursor: pointer;
      &:hover {
        color: $primary;
      }
    }
  `
}
