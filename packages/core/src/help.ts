import { Action, Locale } from "./types";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("hashmd-help")
export class Help extends LitElement {
  @property() locale!: Locale;
  @property() actions!: Action[];

  protected render(): unknown {
    const { actions, locale } = this;

    return html`<h2>${locale.cheatsheet}</h2>
      <ul>
        ${actions.map((action) =>
          action.cheatsheet
            ? html`<li>
                <div class="title">${action.title}</div>
                <div class="gap"></div>
                <div class="content">
                  <code>${action.cheatsheet}</code>
                </div>
              </li>`
            : nothing,
        )}
      </ul>
      <h2>${locale.shortcuts}</h2>
      <ul>
      ${actions.map((action) =>
        action.shortcut
          ? html`<li>
              <div class="title">${action.title}</div>
              <div class="gap"></div>
              <div class="content">
                <code>${action.shortcut}</code>
              </div>
            </li>`
          : nothing,
      )}
      </ul>
    </div>`;
  }

  // TODO: reuse for help and toc
  static styles = css`
    :host {
      font-size: 13px;
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 32px 0 16px;
    }

    ul {
      padding-left: 0;
      color: var(--gray-400);
    }

    ul {
      line-height: 20px;
    }
    li {
      list-style: none;
      display: flex;
      margin-bottom: 12px;
    }
    svg {
      width: 16px;
      height: 16px;
      display: block;
    }
    .gap {
      flex-grow: 1;
    }
    .content {
      float: right;
      font-size: 12px;
    }
  `;
}
