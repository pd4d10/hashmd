import { icons } from "./icons";
import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("hashmd-sidebar")
export class Sidebar extends LitElement {
  protected render(): unknown {
    return html`<div
        class="close"
        @click=${() => {
          this.dispatchEvent(new CustomEvent("close"));
        }}
      >
        ${unsafeHTML(icons.close)}
      </div>
      <slot></slot>`;
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
  `;
}
