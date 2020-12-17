import type { Editor } from 'codemirror';

export type EditorUtils = ReturnType<typeof createUtils>;

export function createUtils(editor: Editor) {
  return {
    /**
     * Wrap text with decorators, for example:
     *
     * `text -> *text*`
     */
    wrapText(before: string, after = before) {
      editor.focus();

      const [selection] = editor.listSelections(); // only handle the first selection
      const from = selection.from(); // use from/to instead of anchor/head for reverse select
      const to = selection.to();

      const text = editor.getRange(from, to) || 'text';
      editor.replaceRange(before + text + after, from, to);

      // select the original text
      const cursor = editor.getCursor();
      editor.setSelection(
        {
          line: cursor.line,
          ch: cursor.ch - after.length - text.length,
        },
        {
          line: cursor.line,
          ch: cursor.ch - after.length,
        }
      );
    },
    /**
     * replace multiple lines
     *
     * `line -> # line`
     */
    replaceLines(replace: (lines: string[]) => string[]) {
      editor.focus();

      const [selection] = editor.listSelections();
      const from = selection.from();
      const to = selection.to();

      const lines = editor
        .getRange(
          { line: from.line, ch: 0 },
          // @ts-ignore
          { line: to.line }
        )
        .split('\n');

      editor.replaceRange(
        replace(lines).join('\n'),
        { line: from.line, ch: 0 },
        // @ts-ignore
        { line: to.line }
      );
    },
    /**
     * Append a block based on the cursor position
     */
    appendBlock(content: string) {
      editor.focus();

      const cursor = editor.getCursor();
      editor.replaceRange(
        '\n' + content,
        // @ts-ignore
        { line: cursor.line }
      );

      return {
        startLine: cursor.line + 1,
      };
    },
  };
}
