import "./codemirror";
import { createEditorView } from "./codemirror";
import { findStartIndex, getLeftItems, replaceLines } from "./editor";
import "./help.js";
import { icons } from "./icons";
import en from "./locales/en.json";
import "./sidebar.js";
import "./status.js";
import "./toc.js";
import "./toolbar.js";
import { Action, EditorProps, Locale, ToolbarItem } from "./types";
import { Meta } from "./viewer-next";
import { EditorView } from "@codemirror/view";
import { Element } from "hast";
import { LitElement, PropertyValueMap, css, html, nothing } from "lit";
import { customElement, eventOptions, property } from "lit/decorators.js";
import { throttle } from "lodash-es";

@customElement("hashmd-editor")
export class Editor extends LitElement {
  @property({ attribute: true }) value: EditorProps["value"] = "";
  @property({ attribute: true }) mode: EditorProps["mode"];
  @property() plugins: NonNullable<EditorProps["plugins"]> = [];
  @property() sanitize: EditorProps["sanitize"];
  @property() remarkRehype: EditorProps["remarkRehype"];
  @property() locale: EditorProps["locale"];
  @property() uploadImages: EditorProps["uploadImages"];

  @property({ state: true }) _containerWidth = Infinity;
  @property({ state: true }) activeTab: false | "write" | "preview" = false;

  @property({ state: true }) fullscreen = false;
  @property({ state: true }) _sync = true;
  @property({ state: true }) sidebar: "help" | "toc" | false = "toc";
  @property({ state: true }) meta?: Meta;
  @property({ state: true }) editCalled = false;
  @property({ state: true }) previewCalled = false;
  @property({ state: true }) editPs: number[] = [];
  @property({ state: true }) previewPs: number[] = [];
  @property({ state: true }) currentBlockIndex = 0;

  private toggleFullscreen() {
    this.fullscreen = !this.fullscreen;

    if (this.fullscreen) {
      Object.assign(this.style, {
        position: "fixed",
        inset: "0",
        border: "none",
        height: "100vh", // override user set height
      });
    } else {
      Object.assign(this.style, {
        position: "",
        inset: "",
        border: "",
        height: "",
      });
    }
  }

  private _editor?: EditorView;

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    this._editor = createEditorView(
      this.value,
      (v) => {
        this.value = v;
        this.dispatchEvent(new CustomEvent("change", { detail: v }));
      },
      this.renderRoot.querySelector(".edit")!,
    );
    // console.log(this._editor)
    this._editor.scrollDOM.addEventListener("scroll", this.editScroll, {
      passive: true,
    });
  }

  updateBlockPositions = throttle(() => {
    if (!this.meta) return;

    const editEl = this._editor!.scrollDOM;
    const previewEl = this.renderRoot.querySelector(".preview")!;
    const body = this.renderRoot.querySelector<HTMLElement>("hashmd-viewer")!;

    this.editPs = [];
    this.previewPs = [];

    const leftNodes = this.meta.hast.children.filter(
      (v): v is Element => v.type === "element",
    );
    const rightNodes = [...body.shadowRoot!.children].filter(
      (v): v is HTMLElement => v instanceof HTMLElement,
    );

    for (let i = 0; i < leftNodes.length; i++) {
      const leftNode = leftNodes[i];
      const rightNode = rightNodes[i];

      // if there is no position info, move to the next node
      if (!leftNode.position) {
        continue;
      }

      const lineHeight =
        this._editor!.contentHeight / this._editor!.state.doc.lines; // TODO: this may not accurate
      const left =
        (lineHeight * (leftNode.position.start.line - 1)) /
        (editEl.scrollHeight - editEl.clientHeight);
      const right =
        (rightNode.offsetTop - body.offsetTop) /
        (previewEl.scrollHeight - previewEl.clientHeight);

      if (left >= 1 || right >= 1) {
        break;
      }

      this.editPs.push(left);
      this.previewPs.push(right);
    }

    this.editPs.push(1);
    this.previewPs.push(1);
    // console.log(this.editPs, this.previewPs)
  }, 1000);

  private editScroll = () => {
    const { _sync, previewCalled, editPs, previewPs, _editor } = this;
    if (!_sync) return;

    const editEl = _editor!.scrollDOM;
    const previewEl = this.renderRoot.querySelector(".preview")!;

    if (previewCalled) {
      this.previewCalled = false;
      return;
    }

    this.updateBlockPositions();

    const leftRatio =
      editEl.scrollTop / (editEl.scrollHeight - editEl.clientHeight);

    const startIndex = findStartIndex(leftRatio, editPs);

    const rightRatio =
      ((leftRatio - editPs[startIndex]) *
        (previewPs[startIndex + 1] - previewPs[startIndex])) /
        (editPs[startIndex + 1] - editPs[startIndex]) +
      previewPs[startIndex];
    // const rightRatio = previewPs[startIndex] // for testing

    previewEl.scrollTo(
      0,
      rightRatio * (previewEl.scrollHeight - previewEl.clientHeight),
    );
    this.editCalled = true;
  };

  @eventOptions({ passive: true })
  private previewScroll() {
    const { _sync, editCalled, previewPs, editPs, _editor } = this;
    if (!_sync) return;

    const editEl = _editor!.scrollDOM;
    const previewEl = this.renderRoot.querySelector<HTMLElement>(".preview")!;

    // find the current block in the view
    this.updateBlockPositions();
    this.currentBlockIndex = findStartIndex(
      previewEl.scrollTop / (previewEl.scrollHeight - previewEl.offsetHeight),
      previewPs,
    );

    if (editCalled) {
      this.editCalled = false;
      return;
    }

    const rightRatio =
      previewEl.scrollTop / (previewEl.scrollHeight - previewEl.clientHeight);

    const startIndex = findStartIndex(rightRatio, previewPs);

    const leftRatio =
      ((rightRatio - previewPs[startIndex]) *
        (editPs[startIndex + 1] - editPs[startIndex])) /
        (previewPs[startIndex + 1] - previewPs[startIndex]) +
      editPs[startIndex];

    if (isNaN(leftRatio)) {
      return;
    }

    editEl.scrollTo(0, leftRatio * (editEl.scrollHeight - editEl.clientHeight));
    this.previewCalled = true;
  }

  private get leftItems() {
    return getLeftItems(this.mergedLocale);
  }

  private get rightItems(): ToolbarItem[] {
    const { activeTab, fullscreen, sidebar, mergedLocale: locale } = this;
    const tocActive = sidebar === "toc";
    const helpActive = sidebar === "help";
    const writeActive = activeTab === "write";
    const previewActive = activeTab === "preview";
    return [
      {
        type: "single",
        title: tocActive ? locale.closeToc : locale.toc,
        icon: icons.toc,
        click: () => {
          this.sidebar = this.sidebar === "toc" ? false : "toc";
        },
        active: tocActive,
      },
      {
        type: "single",
        title: helpActive ? locale.closeHelp : locale.help,
        icon: icons.help,
        click: () => {
          this.sidebar = this.sidebar === "help" ? false : "help";
        },
      },
      {
        type: "single",
        title: writeActive ? locale.exitWriteOnly : locale.writeOnly,
        icon: icons.write,
        click: () => {
          this.dispatchEvent(new CustomEvent("tab", { detail: "write" }));
        },
        active: writeActive,
      },
      {
        type: "single",
        title: previewActive ? locale.exitPreviewOnly : locale.previewOnly,
        icon: icons.preview,
        click: () => {
          this.dispatchEvent(new CustomEvent("tab", { detail: "preview" }));
        },
        active: previewActive,
      },
      {
        type: "single",
        title: fullscreen ? locale.exitFullscreen : locale.fullscreen,
        icon: fullscreen ? icons.exitFullscreen : icons.fullscreen,
        click: () => {
          this.toggleFullscreen();
        },
      },
      {
        type: "single",
        title: locale.source,
        icon: icons.source,
        click: () => {
          window.open("https://github.com/pd4d10/hashmd");
        },
      },
    ];
  }

  private get toolbarItems(): ToolbarItem[] {
    return [
      ...this.leftItems,
      ...this.plugins.flatMap((p) => p.toolbar ?? []),
      { type: "space" },
      ...this.rightItems,
    ];
  }

  private get actions(): Action[] {
    return this.toolbarItems.flatMap((item) => {
      if (item.type === "single") {
        return [item];
      } else if (item.type === "multiple") {
        return item.actions;
      } else {
        return [];
      }
    });
  }

  private get mergedLocale(): Locale {
    return { ...this.locale, ...en };
  }

  render() {
    const {
      value,
      plugins,
      sanitize,
      mode = "auto",
      locale,
      uploadImages,
      mergedLocale,
      toolbarItems,
      actions,

      _containerWidth,
      activeTab,
      fullscreen,
      sidebar,
    } = this;
    const split =
      mode === "split" || (mode === "auto" && _containerWidth >= 800);

    return html`<hashmd-toolbar
        .items=${toolbarItems}
        .locale=${mergedLocale}
        .sidebar=${sidebar}
        .context=${{ editor: this._editor! }}
        .fullscreen=${fullscreen}
      ></hashmd-toolbar>
      <div class="body">
        ${split ? html`<div class="edit"></div>` : nothing}
        <div class="preview" @scroll=${this.previewScroll}>
          <hashmd-viewer
            .value=${value}
            @meta=${(e: CustomEvent) => {
              this.meta = e.detail;
            }}
          ></hashmd-viewer>
        </div>
        ${sidebar
          ? html`<hashmd-sidebar
              @close=${() => {
                this.sidebar = false;
              }}
            >
              ${sidebar === "help"
                ? html`<hashmd-help
                    .locale=${mergedLocale}
                    .actions=${actions}
                  ></hashmd-help>`
                : sidebar === "toc"
                ? html`<hashmd-toc
                    .locale=${mergedLocale}
                    .currentBlockIndex=${this.currentBlockIndex}
                    .meta=${this.meta}
                  ></hashmd-toc>`
                : nothing}
            </hashmd-sidebar>`
          : nothing}
      </div>
      <hashmd-status
        .value=${value}
        .locale=${mergedLocale}
        .sync=${this._sync}
        @toggle-sync=${() => {
          this._sync = !this._sync;
        }}
        @scroll-top=${() => {
          this._editor?.scrollDOM?.scrollIntoView();
          this.shadowRoot?.querySelector("hashmd-viewer")?.scrollIntoView();
        }}
      ></hashmd-status>`;
  }

  static styles = css`
    * {
      box-sizing: border-box;
    }

    :host {
      --primary: #0366d6;
      --gray-000: #fafbfc;
      --gray-100: #f6f8fa;
      --gray-400: #959da5;
      --gray-700: #444d56;
      --gray-900: #24292e;
      --border-color: #e1e4e8;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        Segoe UI,
        Helvetica,
        Arial,
        sans-serif,
        Apple Color Emoji,
        Segoe UI Emoji;
      color: var(--gray-900);
      border: 1px solid var(--border-color);
      /* background-color: #fff; */
      height: 600px;
      display: flex;
      flex-direction: column;
    }

    hashmd-toolbar {
      flex-shrink: 0;
    }

    .body {
      flex-basis: 0;
      flex-grow: 1;
      display: flex;
      overflow: auto;
    }

    .edit {
      border-right: 1px solid var(--border-color);
    }

    .cm-editor {
      height: 100%;
    }

    .edit,
    .preview,
    hashmd-sidebar {
      height: 100%;
      overflow: auto;
    }

    .edit,
    .preview {
      flex: 1;
      min-width: 0; // https://stackoverflow.com/a/66689926
    }

    hashmd-sidebar {
      flex: 0 0 280px;
    }

    .preview {
      padding: 16px;
    }

    hashmd-status {
      border-top: 1px solid var(--border-color);
    }

    :host.fullscreen {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border: none;
      height: 100vh !important; // override user set height
    }

    .tippy-box {
      font-size: 12px;
    }
  `;
}
