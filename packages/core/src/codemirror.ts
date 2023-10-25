import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import {
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
} from "@codemirror/language";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import {
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  keymap,
  EditorView,
} from "@codemirror/view";

export const createEditorView = (
  initialValue: string,
  onChange: (v: string) => void,
  parent: HTMLElement,
) => {
  const updateListener = EditorView.updateListener.of((vu) => {
    // console.log(vu)
    if (vu.docChanged) {
      onChange(vu.state.doc.toString());
    }
  });

  const theme = EditorView.theme({
    "& .cm-scroller": {
      fontFamily: "SF Mono, Consolas, Liberation Mono, Menlo, monospace",
      fontSize: "14px",
      padding: "16px",
    },
  });

  return new EditorView({
    doc: initialValue,
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
    parent,
  });
};
