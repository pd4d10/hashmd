import type { Editor } from 'codemirror';

export type EditorUtils = ReturnType<typeof createUtils>;

export function createUtils(editor: Editor) {
  return {
    /**
     * text -> _text_
     */
    replaceText(replace: (text: string) => string) {
      if (editor.somethingSelected()) {
        editor.replaceSelection(replace(editor.getSelection()));
      } else {
        const { anchor, head } = editor.findWordAt(editor.getCursor());
        const word = editor.getRange(anchor, head);
        editor.replaceRange(replace(word), anchor, head);
      }
      editor.focus();
    },
    /**
     * line -> # line
     */
    replaceLines(replace: (lines: string[]) => string[]) {
      const [selection] = editor.listSelections();
      const fromLine = selection.from().line;
      const toLine = selection.to().line;
      const lines = editor
        // @ts-ignore
        .getRange({ line: fromLine, ch: 0 }, { line: toLine })
        .split('\n');
      editor.replaceRange(
        replace(lines).join('\n'),
        { line: fromLine, ch: 0 },
        // @ts-ignore
        { line: toLine }
      );

      editor.focus();
    },
  };
}
