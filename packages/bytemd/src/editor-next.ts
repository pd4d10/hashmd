import en from '../locales/en.json'
import { getBuiltinActions } from './editor'
import './toolbar.js'
import { EditorProps } from './types'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

@customElement('bytemd-editor')
export class Editor extends LitElement {
  @property({ attribute: true }) value: EditorProps['value'] = ''
  @property() plugins: NonNullable<EditorProps['plugins']> = []
  @property() sanitize: EditorProps['sanitize'] = undefined
  @property() remarkRehype: EditorProps['remarkRehype'] = undefined
  @property() mode: NonNullable<EditorProps['mode']> = 'auto'
  @property() locale: EditorProps['locale']
  @property() uploadImages: EditorProps['uploadImages']

  @property({ state: true }) _containerWidth = Infinity
  @property({ state: true }) _activeTab: false | 'write' | 'preview' = false
  @property({ state: true }) _fullscreen = false

  render() {
    const {
      value,
      plugins,
      sanitize,
      mode,
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
      ></bytemd-toolbar>
      <div class="body">
        <textarea .value=${value}></textarea
        ><bytemd-viewer .value=${value}></bytemd-viewer>
      </div>
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

    textarea,
    bytemd-viewer {
      flex: 1;
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
