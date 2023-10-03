import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete'
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
} from '@codemirror/language'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
  EditorView,
} from '@codemirror/view'
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

    const theme = EditorView.theme({
      '& .cm-scroller': {
        fontFamily: 'SF Mono, Consolas, Liberation Mono, Menlo, monospace',
        fontSize: '14px',
        padding: '16px',
      },
    })

    this.editor = new EditorView({
      doc: this.value,
      extensions: [
        // tweaked from basicSetup: https://github.com/codemirror/basic-setup/blob/b3be7cd30496ee578005bd11b1fa6a8b21fcbece/src/codemirror.ts#L50
        // lineNumbers(),
        // highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        // foldGutter(),
        drawSelection(),
        dropCursor(),
        // EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        // autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        // highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          // ...foldKeymap,
          // ...completionKeymap,
          // ...lintKeymap,
        ]),

        // extra
        EditorView.lineWrapping,
        theme,
        markdown({
          extensions: [],
        }),
        updateListener,
      ],
      parent: this.renderRoot,
    })

    this.dispatchEvent(new CustomEvent('context', { detail: this.editor }))
  }

  static styles = css`
    .cm-editor {
      height: 100%;
    }
  `
}
