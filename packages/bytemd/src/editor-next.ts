import './codemirror'
import { createEditorView } from './codemirror'
import { findStartIndex, getBuiltinActions } from './editor'
import './help.js'
import en from './locales/en.json'
import './sidebar.js'
import './status.js'
import './toc.js'
import './toolbar.js'
import { EditorProps } from './types'
import { Meta } from './viewer-next'
import { EditorView } from '@codemirror/view'
import { Element, Root } from 'hast'
import { LitElement, PropertyValueMap, css, html, nothing } from 'lit'
import { customElement, eventOptions, property } from 'lit/decorators.js'
import { throttle } from 'lodash-es'

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
  @property({ state: true }) _sync = true
  @property({ state: true }) _sidebar: 'help' | 'toc' | false = 'toc'
  @property({ state: true }) meta?: Meta

  @property({ state: true }) editCalled = false
  @property({ state: true }) previewCalled = false
  @property({ state: true }) editPs: number[] = []
  @property({ state: true }) previewPs: number[] = []
  @property({ state: true }) currentBlockIndex = 0

  private _editor?: EditorView

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    this._editor = createEditorView(
      this.value,
      (v) => {
        this.value = v
        this.dispatchEvent(new CustomEvent('change', { detail: v }))
      },
      this.renderRoot.querySelector('.edit')!,
    )
    // console.log(this._editor)
    this._editor.scrollDOM.addEventListener('scroll', this.editScroll, {
      passive: true,
    })
  }

  updateBlockPositions = throttle(() => {
    if (!this.meta) return

    const editEl = this._editor!.scrollDOM
    const previewEl = this.renderRoot.querySelector('.preview')!
    const body = this.renderRoot.querySelector<HTMLElement>('bytemd-viewer')!

    this.editPs = []
    this.previewPs = []

    const leftNodes = this.meta.hast.children.filter(
      (v): v is Element => v.type === 'element',
    )
    const rightNodes = [...body.shadowRoot!.children].filter(
      (v): v is HTMLElement => v instanceof HTMLElement,
    )

    for (let i = 0; i < leftNodes.length; i++) {
      const leftNode = leftNodes[i]
      const rightNode = rightNodes[i]

      // if there is no position info, move to the next node
      if (!leftNode.position) {
        continue
      }

      const lineHeight =
        this._editor!.contentHeight / this._editor!.state.doc.lines // TODO: this may not accurate
      const left =
        (lineHeight * (leftNode.position.start.line - 1)) /
        (editEl.scrollHeight - editEl.clientHeight)
      const right =
        (rightNode.offsetTop - body.offsetTop) /
        (previewEl.scrollHeight - previewEl.clientHeight)

      if (left >= 1 || right >= 1) {
        break
      }

      this.editPs.push(left)
      this.previewPs.push(right)
    }

    this.editPs.push(1)
    this.previewPs.push(1)
    // console.log(this.editPs, this.previewPs)
  }, 1000)

  private editScroll = () => {
    const { _sync, previewCalled, editPs, previewPs, _editor } = this
    if (!_sync) return

    const editEl = _editor!.scrollDOM
    const previewEl = this.renderRoot.querySelector('.preview')!

    if (previewCalled) {
      this.previewCalled = false
      return
    }

    this.updateBlockPositions()

    const leftRatio =
      editEl.scrollTop / (editEl.scrollHeight - editEl.clientHeight)

    const startIndex = findStartIndex(leftRatio, editPs)

    const rightRatio =
      ((leftRatio - editPs[startIndex]) *
        (previewPs[startIndex + 1] - previewPs[startIndex])) /
        (editPs[startIndex + 1] - editPs[startIndex]) +
      previewPs[startIndex]
    // const rightRatio = previewPs[startIndex] // for testing

    previewEl.scrollTo(
      0,
      rightRatio * (previewEl.scrollHeight - previewEl.clientHeight),
    )
    this.editCalled = true
  }

  @eventOptions({ passive: true })
  private previewScroll() {
    const { _sync, editCalled, previewPs, editPs, _editor } = this
    if (!_sync) return

    const editEl = _editor!.scrollDOM
    const previewEl = this.renderRoot.querySelector<HTMLElement>('.preview')!

    // find the current block in the view
    this.updateBlockPositions()
    this.currentBlockIndex = findStartIndex(
      previewEl.scrollTop / (previewEl.scrollHeight - previewEl.offsetHeight),
      previewPs,
    )

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

    editEl.scrollTo(0, leftRatio * (editEl.scrollHeight - editEl.clientHeight))
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
    } = this
    const mergedLocale = { ...en, ...locale }
    const actions = getBuiltinActions(mergedLocale, plugins, uploadImages)

    const split =
      mode === 'split' || (mode === 'auto' && _containerWidth >= 800)

    return html`<bytemd-toolbar
        .actions=${actions.leftActions}
        .rightAfferentActions=${actions.rightActions}
        .locale=${mergedLocale}
        .sidebar=${_sidebar}
        .context=${{ editor: this._editor! }}
        .fullscreen=${_fullscreen}
        @toggle-sidebar=${(e: CustomEvent) => {
          this._sidebar = this._sidebar === e.detail ? false : e.detail
        }}
        @toggle-fullscreen=${() => {
          this._fullscreen = !this._fullscreen
        }}
      ></bytemd-toolbar>
      <div class="body">
        ${split ? html`<div class="edit"></div>` : nothing}
        <div class="preview" @scroll=${this.previewScroll}>
          <bytemd-viewer
            .value=${value}
            @meta=${(e: CustomEvent) => {
              this.meta = e.detail
            }}
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
                    .currentBlockIndex=${this.currentBlockIndex}
                    .meta=${this.meta}
                  ></bytemd-toc>`
                : nothing}
            </bytemd-sidebar>`
          : nothing}
      </div>
      <bytemd-status
        .value=${value}
        .locale=${mergedLocale}
        .sync=${this._sync}
        @toggle-sync=${() => {
          this._sync = !this._sync
        }}
        @scroll-top=${() => {
          this._editor?.scrollDOM?.scrollIntoView()
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

    .edit {
      border-right: 1px solid var(--border-color);
    }

    .cm-editor {
      height: 100%;
    }

    .edit,
    .preview,
    bytemd-sidebar {
      height: 100%;
      overflow: auto;
    }

    .edit,
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
