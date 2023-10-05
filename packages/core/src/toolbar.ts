import { icons } from "./icons";
import {
  HashmdAction,
  HashmdEditorContext,
  HashmdLocale,
  ViewerProps,
} from "./types";
import { getProcessor } from "./utils";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { LitElement, html, css, nothing, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

interface RightAction extends HashmdAction {
  active?: boolean;
  hidden?: boolean;
}

@customElement("hashmd-toolbar")
export class Toolbar extends LitElement {
  @property() actions!: HashmdAction[];
  @property() rightAfferentActions!: HashmdAction[];
  @property() sidebar!: false | "help" | "toc";
  @property() locale!: HashmdLocale;
  @property() context!: HashmdEditorContext;
  @property() fullscreen!: boolean;

  @property() activeTab: "icon" | "write" | "preview" = "icon"; // TODO:

  get rightActions() {
    const {
      activeTab,
      fullscreen,
      sidebar,
      locale,
      actions,
      rightAfferentActions,
    } = this;

    const split = activeTab === "icon";
    const tocActive = sidebar === "toc";
    const helpActive = sidebar === "help";
    const writeActive = activeTab === "write";
    const previewActive = activeTab === "preview";
    const rightActions: RightAction[] = [
      {
        title: tocActive ? locale.closeToc : locale.toc,
        icon: icons.AlignTextLeftOne,
        handler: {
          type: "action",
          click: () => {
            this.dispatchEvent(
              new CustomEvent("toggle-sidebar", { detail: "toc" }),
            );
          },
        },
        active: tocActive,
      },
      {
        title: helpActive ? locale.closeHelp : locale.help,
        icon: icons.Helpcenter,
        handler: {
          type: "action",
          click: () => {
            this.dispatchEvent(
              new CustomEvent("toggle-sidebar", { detail: "help" }),
            );
          },
        },
        active: helpActive,
      },
      {
        title: writeActive ? locale.exitWriteOnly : locale.writeOnly,
        icon: icons.LeftExpand,
        handler: {
          type: "action",
          click: () => {
            this.dispatchEvent(new CustomEvent("tab", { detail: "write" }));
          },
        },
        active: writeActive,
        hidden: !split,
      },
      {
        title: previewActive ? locale.exitPreviewOnly : locale.previewOnly,
        icon: icons.RightExpand,
        handler: {
          type: "action",
          click: () => {
            this.dispatchEvent(new CustomEvent("tab", { detail: "preview" }));
          },
        },
        active: previewActive,
        hidden: !split,
      },
      {
        title: fullscreen ? locale.exitFullscreen : locale.fullscreen,
        icon: fullscreen ? icons.OffScreen : icons.FullScreen,
        handler: {
          type: "action",
          click: () => {
            this.dispatchEvent(new CustomEvent("toggle-fullscreen"));
          },
        },
      },
      {
        title: locale.source,
        icon: icons.GithubOne,
        handler: {
          type: "action",
          click: () => {
            window.open("https://github.com/pd4d10/hashmd");
          },
        },
      },
      ...rightAfferentActions,
    ];

    return rightActions;
  }

  render() {
    const {
      activeTab,
      fullscreen,
      sidebar,
      locale,
      actions,
      rightAfferentActions,

      rightActions,
    } = this;

    const split = activeTab === "icon";

    return html`<div class="toolbar">
      ${split
        ? actions.map((item, index) =>
            item.handler
              ? html`
                  <div
                    class="icon"
                    key="icon-${index}"
                    @click=${() => {
                      if (item.handler?.type === "action") {
                        item.handler.click(this.context);
                      }
                    }}
                    @mouseenter=${() => {
                      if (item.handler?.type === "dropdown") {
                        const button = this.renderRoot.querySelector(
                          `[key=icon-${index}]`,
                        )!;
                        const dropdown =
                          this.renderRoot.querySelector<HTMLElement>(
                            `[key=dropdown-${index}]`,
                          )!;

                        computePosition(button, dropdown, {
                          placement: "bottom-start",
                          middleware: [flip(), shift()],
                        }).then(({ x, y }) => {
                          dropdown.style.left = `${x}px`;
                          dropdown.style.top = `${y}px`;
                        });
                      }
                    }}
                    @mouseleave=${() => {
                      if (item.handler?.type === "dropdown") {
                        const dropdown =
                          this.renderRoot.querySelector<HTMLElement>(
                            `[key=dropdown-${index}]`,
                          )!;
                        dropdown.style.left = "";
                        dropdown.style.top = "";
                      }
                    }}
                  >
                    ${unsafeHTML(item.icon)}
                    ${item.handler.type === "dropdown"
                      ? html`
                          <div class="dropdown" key="dropdown-${index}">
                            <div class="dropdown-title">${item.title}</div>
                            ${item.handler.actions.map(
                              (subAction, i) => html`
                                <div
                                  class="dropdown-item"
                                  key=${[index, i].join("-")}
                                  @click=${() => {
                                    if (subAction.handler?.type === "action") {
                                      subAction.handler?.click?.(this.context);
                                    }
                                  }}
                                  @mouseenter=${() => {
                                    if (subAction.handler?.type === "action") {
                                      subAction.handler?.mouseenter?.(
                                        this.context,
                                      );
                                    }
                                  }}
                                  @mouseleave=${() => {
                                    if (subAction.handler?.type === "action") {
                                      subAction.handler.mouseleave?.(
                                        this.context,
                                      );
                                    }
                                  }}
                                >
                                  ${subAction.title}
                                </div>
                              `,
                            )}
                          </div>
                        `
                      : nothing}
                  </div>
                `
              : nothing,
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
      <div class="gap"></div>
      ${rightActions.map((item, index) =>
        item.hidden
          ? nothing
          : html`
              <div
                class=${classMap({
                  icon: true,
                  active: item.active ?? false,
                })}
                key=${index}
                @click=${() => {
                  if (item.handler?.type === "action") {
                    item.handler.click(this.context);
                  }
                }}
              >
                ${unsafeHTML(item.icon)}
              </div>
            `,
      )}
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
