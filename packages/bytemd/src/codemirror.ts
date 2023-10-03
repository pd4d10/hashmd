import { markdown } from '@codemirror/lang-markdown'
import { EditorView, minimalSetup, basicSetup } from 'codemirror'
import { LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('bytemd-codemirror')
export class Codemirror extends LitElement {
  @property() value: string = ''
  @property() editor: EditorView | null = null

  firstUpdated() {
    const updateListener = EditorView.updateListener.of((vu) => {
      // console.log(vu)
      if (vu.docChanged) {
        this.dispatchEvent(
          new CustomEvent('change', { detail: vu.state.doc.toString() }),
        )
      }
    })

    this.editor = new EditorView({
      doc: this.value,
      extensions: [
        EditorView.lineWrapping,
        basicSetup,
        markdown({
          extensions: [],
        }),
        updateListener,
      ],
      parent: this.renderRoot,
    })
  }

  static styles = css`
    .cm-editor {
      height: 100%;
    }
  `
}
