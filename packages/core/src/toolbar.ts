import { EditorContext, Locale, ToolbarItem } from "./types";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("hashmd-toolbar")
export class Toolbar extends LitElement {
  @property() items!: ToolbarItem[];
  @property() locale!: Locale;
  @property() context!: EditorContext;
  @property() activeTab: "icon" | "write" | "preview" = "icon"; // TODO:

  render() {
    const { activeTab, locale, items } = this;

    const split = activeTab === "icon";

    return html`<div class="toolbar">
      ${split
        ? items.map((item) =>
            item.type === "space"
              ? html`<div class="gap"></div>`
              : item.type === "divider"
              ? html`<div>todo</div>`
              : html`
                  <div
                    class="icon"
                    title=${item.title}
                    @click=${() => {
                      if (item.type === "single") {
                        item.click(
                          new CustomEvent("click", { detail: this.context }),
                        );
                      }
                    }}
                    @mouseenter=${(e: MouseEvent) => {
                      if (item.type === "multiple") {
                        const button = e.target as HTMLElement;
                        const dropdown =
                          button.querySelector<HTMLElement>(".dropdown")!;

                        computePosition(button, dropdown, {
                          placement: "bottom-start",
                          middleware: [flip(), shift()],
                        }).then(({ x, y }) => {
                          dropdown.style.left = `${x}px`;
                          dropdown.style.top = `${y}px`;
                        });
                      }
                    }}
                    @mouseleave=${(e: MouseEvent) => {
                      if (item.type === "multiple") {
                        const button = e.target as HTMLElement;
                        const dropdown =
                          button.querySelector<HTMLElement>(".dropdown")!;

                        dropdown.style.left = "";
                        dropdown.style.top = "";
                      }
                    }}
                  >
                    ${unsafeHTML(item.icon)}
                    ${item.type === "multiple"
                      ? html`
                          <div class="dropdown">
                            <div class="dropdown-title">${item.title}</div>
                            ${item.actions.map(
                              (action) => html`
                                <div
                                  class="dropdown-item"
                                  @click=${() => {
                                    action.click(
                                      new CustomEvent("click", {
                                        detail: this.context,
                                      }),
                                    );
                                  }}
                                  @mouseenter=${() => {
                                    action.mouseenter?.(
                                      new CustomEvent("mouseenter", {
                                        detail: this.context,
                                      }),
                                    );
                                  }}
                                  @mouseleave=${() => {
                                    action.mouseleave?.(
                                      new CustomEvent("mouseleave", {
                                        detail: this.context,
                                      }),
                                    );
                                  }}
                                >
                                  ${action.title}
                                </div>
                              `,
                            )}
                          </div>
                        `
                      : nothing}
                  </div>
                `,
          )
        : html`<div
              @click=${() => {
                this.dispatchEvent(new CustomEvent("tab", { detail: "write" }));
              }}
              @keydown=${() => {
                //
              }}
              class=${classMap({
                tab: true,
                active: activeTab !== "preview",
              })}
            >
              ${locale.write}
            </div>
            <div
              @click=${() => {
                this.dispatchEvent(
                  new CustomEvent("tab", { detail: "preview" }),
                );
              }}
              @keydown=${() => {
                //
              }}
              class=${classMap({
                tab: true,
                "tab-active": activeTab === "preview",
              })}
            >
              ${locale.preview}
            </div>`}
    </div> `;
  }

  static styles = css`
    * {
      box-sizing: border-box;
    }

    .toolbar {
      padding: 4px 12px;
      border-bottom: 1px solid var(--border-color);
      background-color: var(--gray-000);
      user-select: none;
      overflow: hidden;
      display: flex;
    }

    .tab {
      cursor: pointer;
      padding-left: 8px;
      padding-right: 8px;
      line-height: 24px;
      font-size: 14px;
    }

    .active {
      color: var(--primary);
    }

    .icon {
      border-radius: 4px;
      margin-left: 6px;
      margin-right: 6px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon svg {
      cursor: pointer;
    }

    .icon:hover {
      background-color: var(--border-color);
    }

    .gap {
      flex-grow: 1;
    }

    .dropdown {
      max-height: 300px;
      overflow: auto;
      font-size: 14px;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      position: absolute;
      top: -99999px;
      left: -99999px;
      z-index: 99999;
    }
    .dropdown-title {
      margin: 0 12px;
      font-weight: 500;
      border-bottom: 1px solid var(--border-color);
      line-height: 32px;
      color: var(--gray-700);
    }
    .dropdown-item {
      padding: 0 12px;
      line-height: 32px;
      cursor: pointer;
    }
    .dropdown-item:hover {
      background-color: var(--gray-100);
    }
  `;
}
