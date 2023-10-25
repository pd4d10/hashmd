import { Locale, EditorProps } from "./types";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
// @ts-ignore
import wordCount from "word-count";

@customElement("hashmd-status")
export class Status extends LitElement {
  @property() value!: string;
  @property() locale!: Locale;
  @property() sync!: boolean;

  protected render(): unknown {
    const { value, locale, sync } = this;

    const words = wordCount(value);
    const lines = value.split("\n").length;

    return html`
      <div>${locale.words}: <strong>${words}</strong></div>
      <div>${locale.lines}: <strong>${lines}</strong></div>
      <div class="gap"></div>
      <label>
        <input
          type="checkbox"
          ?checked=${sync}
          @change=${() => {
            this.dispatchEvent(new CustomEvent("toggle-sync"));
          }}
        />${locale.sync}
      </label>
      <div
        class="top"
        @click=${() => {
          this.dispatchEvent(new CustomEvent("scroll-top"));
        }}
      >
        ${locale.top}
      </div>
    `;
  }

  static styles = css`
    :host {
      font-size: 12px;
      line-height: 24px;
      user-select: none;
      padding: 0 8px;
      display: flex;
    }

    .gap {
      flex-grow: 1;
    }

    strong {
      font-weight: 600;
    }

    :host > * {
      padding: 0 8px;
    }

    .top {
      cursor: pointer;
    }

    .top:hover {
      color: var(--primary);
    }

    input {
      vertical-align: middle;
      margin-right: 3px; // CSS reset
    }
  `;
}
