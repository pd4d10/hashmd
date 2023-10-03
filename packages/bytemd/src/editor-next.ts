import en from '../locales/en.json'
import './codemirror'
import { getBuiltinActions } from './editor'
import './status.js'
import './toolbar.js'
import { BytemdEditorContext, EditorProps } from './types'
import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

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
    } = this
    const mergedLocale = { ...en, ...locale }
    const actions = getBuiltinActions(mergedLocale, plugins, uploadImages)

    const split =
      mode === 'split' || (mode === 'auto' && _containerWidth >= 800)

    return html`
      <bytemd-toolbar
        .actions=${actions.leftActions}
        .rightAfferentActions=${actions.rightActions}
        .locale=${mergedLocale}
        .context=${this._context}
      ></bytemd-toolbar>
      <div class="body">
        ${split
          ? html`
              <bytemd-codemirror
                .value=${value}
                @change=${(e: CustomEvent) => {
                  this.value = e.detail
                }}
                @context=${(e: CustomEvent) => {
                  this._context = { editor: e.detail }
                }}
              ></bytemd-codemirror>
            `
          : nothing}
        <div class="preview">
          <bytemd-viewer .value=${value}></bytemd-viewer>
        </div>
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
      ></bytemd-status>
    `
  }

  static styles = css`
    * {
      box-sizing: border-box;
    }

    :host {
      --primary: #0366d6;
      --gray-000: #fafbfc;
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
    .preview {
      flex: 1;
      min-width: 0; // https://stackoverflow.com/a/66689926
      height: 100%;
      overflow: auto;
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
