import type { Locale } from "./types";
import { Meta } from "./viewer-next";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("hashmd-toc")
export class Toc extends LitElement {
  @property() meta?: Meta;
  @property() currentBlockIndex!: number;
  @property() locale!: Locale;

  protected render(): unknown {
    const { meta } = this;
    if (!meta) return nothing;

    const minLevel = meta.toc.reduce(
      (min, { level }) => Math.min(min, level),
      6,
    );

    return html`<h2>${this.locale.toc}</h2>
      <ul>
        ${meta.toc.map(
          ({ level, text }, index) =>
            html`<li
              class=${classMap({
                [`toc-${level}`]: true,
                active: this.currentBlockIndex === index,
                first: level === minLevel,
              })}
              style=${styleMap({
                paddingLeft: `${(level - minLevel) * 16 + 8}px`,
              })}
              @click=${() => {
                this.dispatchEvent(new CustomEvent("click", { detail: index }));
              }}
            >
              ${text}
            </li>`,
        )}
      </ul>`;
  }

  static styles = css`
    li {
      list-style: none;
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 2;
      cursor: pointer;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .active {
      color: var(--primary);
      background-color: var(--gray-100);
    }
    &-first {
      font-weight: 500;
    }
  `;
}
