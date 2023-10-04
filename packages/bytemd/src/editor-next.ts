import en from '../locales/en.json'
import './codemirror'
import { findStartIndex, getBuiltinActions } from './editor'
import './help.js'
import './sidebar.js'
import './status.js'
import './toc.js'
import './toolbar.js'
import { BytemdEditorContext, EditorProps } from './types'
import { Root } from 'hast'
import { LitElement, css, html, nothing } from 'lit'
import { customElement, eventOptions, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

@customElement('bytemd-editor')
export class Editor extends LitElement {
  @property({ attribute: true }) value: EditorProps['value'] = ''
  @property({ attribute: true }) mode: EditorProps['mode']
  @property() plugins: NonNullable<EditorProps['plugins']> = []
  @property() sanitize: EditorProps['sanitize']
  @property() remarkRehype: EditorProps['remarkRehype']
  @property() locale: EditorProps['locale']
  @property() uploadImages: EditorProps['uploadImages']

  @property({ state: true }) _containerWidth = Infinity
  @property({ state: true }) _activeTab: false | 'write' | 'preview' = false
  @property({ state: true }) _fullscreen = false
  @property({ state: true }) _sync = false
  @property({ state: true }) _context: BytemdEditorContext | undefined
  @property({ state: true }) _sidebar: 'help' | 'toc' | false = 'toc'
  @property({ state: true }) _hast?: Root

  @property({ state: true }) editCalled = false
  @property({ state: true }) previewCalled = false
  @property({ state: true }) editPs: number[] = []
  @property({ state: true }) previewPs: number[] = []
  @property({ state: true }) currentBlockIndex = 0

  private updateBlockPositions() {
    // TODO:
  }

  private editorScrollHandler() {
    const { _sync, previewCalled, editPs, previewPs } = this
    const { editor } = this._context!
    const previewEl = this.renderRoot.querySelector('bytemd-viewer')!

    if (!_sync) return

    if (previewCalled) {
      this.previewCalled = false
      return
    }

    this.updateBlockPositions()

    const info = editor.getScrollInfo()
    const leftRatio = info.top / (info.height - info.clientHeight)

    const startIndex = findStartIndex(leftRatio, editPs)

    const rightRatio =
      ((leftRatio - editPs[startIndex]) *
        (previewPs[startIndex + 1] - previewPs[startIndex])) /
        (editPs[startIndex + 1] - editPs[startIndex]) +
      previewPs[startIndex]
    // const rightRatio = rightPs[startIndex]; // for testing

    previewEl.scrollTo(
      0,
      rightRatio * (previewEl.scrollHeight - previewEl.clientHeight),
    )
    this.editCalled = true
  }

  @eventOptions({ passive: true })
  private _previewScroll(e: Event) {
    const previewEl = e.target as HTMLElement
    const { _sync: syncEnabled, editCalled, previewPs, editPs } = this
    const { editor } = this._context!

    // find the current block in the view
    this.updateBlockPositions()
    this.currentBlockIndex = findStartIndex(
      previewEl.scrollTop / (previewEl.scrollHeight - previewEl.offsetHeight),
      previewPs,
    )

    if (!syncEnabled) return

    if (editCalled) {
      this.editCalled = false
      return
    }

    const rightRatio =
      previewEl.scrollTop / (previewEl.scrollHeight - previewEl.clientHeight)

    const startIndex = findStartIndex(rightRatio, previewPs)

    const leftRatio =
      ((rightRatio - previewPs[startIndex]) *
        (editPs[startIndex + 1] - editPs[startIndex])) /
        (previewPs[startIndex + 1] - previewPs[startIndex]) +
      editPs[startIndex]

    if (isNaN(leftRatio)) {
      return
    }

    const info = editor.getScrollInfo()
    editor.scrollTo(0, leftRatio * (info.height - info.clientHeight))
    this.previewCalled = true
  }

  render() {
    const {
      value,
      plugins,
      sanitize,
      mode = 'auto',
      locale,
      uploadImages,

      _containerWidth,
      _activeTab,
      _fullscreen,
      _sidebar,
      _hast,
    } = this
    const mergedLocale = { ...en, ...locale }
    const actions = getBuiltinActions(mergedLocale, plugins, uploadImages)

    const split =
      mode === 'split' || (mode === 'auto' && _containerWidth >= 800)

    return html`<bytemd-toolbar
        .actions=${actions.leftActions}
        .rightAfferentActions=${actions.rightActions}
        .locale=${mergedLocale}
        .context=${this._context}
        .sidebar=${_sidebar}
        @toggle-sidebar=${(e: CustomEvent) => {
          this._sidebar = this._sidebar === e.detail ? false : e.detail
        }}
        @toggle-fullscreen=${(e: CustomEvent) => {
          this._fullscreen = !this._fullscreen
        }}
      ></bytemd-toolbar>
      <div class="body">
        ${split
          ? html`<bytemd-codemirror
              .value=${value}
              @change=${(e: CustomEvent) => {
                this.value = e.detail
              }}
              @context=${(e: CustomEvent) => {
                this._context = { editor: e.detail }
              }}
            ></bytemd-codemirror> `
          : nothing}
        <div class="preview">
          <bytemd-viewer
            .value=${value}
            @info=${(e: CustomEvent) => {
              this._hast = e.detail.hast
            }}
            @scroll=${this._previewScroll}
          ></bytemd-viewer>
        </div>
        ${_sidebar
          ? html`<bytemd-sidebar
              @close=${() => {
                this._sidebar = false
              }}
            >
              ${_sidebar === 'help'
                ? html`<bytemd-help
                    .locale=${mergedLocale}
                    .actions=${actions.leftActions}
                  ></bytemd-help>`
                : _sidebar === 'toc'
                ? html`<bytemd-toc
                    .locale=${mergedLocale}
                    .hast=${_hast}
                  ></bytemd-toc>`
                : nothing}
            </bytemd-sidebar>`
          : nothing}
      </div>
      <bytemd-status
        .value=${value}
        .locale=${mergedLocale}
        @toggle-sync=${() => {
          this._sync = !this._sync
        }}
        @scroll-top=${() => {
          this.shadowRoot
            ?.querySelector('bytemd-codemirror')
            ?.shadowRoot?.querySelector('.cm-content')
            ?.scrollIntoView()
          this.shadowRoot?.querySelector('bytemd-viewer')?.scrollIntoView()
        }}
      ></bytemd-status>`
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

    bytemd-toolbar {
      flex-shrink: 0;
    }

    .body {
      flex-basis: 0;
      flex-grow: 1;
      display: flex;
      overflow: auto;
    }

    bytemd-codemirror {
      border-right: 1px solid var(--border-color);
    }

    bytemd-codemirror,
    .preview,
    bytemd-sidebar {
      height: 100%;
      overflow: auto;
    }

    bytemd-codemirror,
    .preview {
      flex: 1;
      min-width: 0; // https://stackoverflow.com/a/66689926
    }

    bytemd-sidebar {
      flex: 0 0 280px;
    }

    .preview {
      padding: 16px;
    }

    bytemd-status {
      border-top: 1px solid var(--border-color);
    }

    .fullscreen {
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
  `
}
