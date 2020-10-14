import type { BytemdPlugin } from 'bytemd';
import remarkGfm, { RemarkGfmOptions } from 'remark-gfm';
import * as icon from '@icon-park/svg';

// TODO:
function handlePrepend(
  cm: CodeMirror.Editor,
  replace: (lines: string[]) => string[]
) {
  const [selection] = cm.listSelections();
  const fromLine = selection.from().line;
  const toLine = selection.to().line;
  const lines = cm
    // @ts-ignore
    .getRange({ line: fromLine, ch: 0 }, { line: toLine })
    .split('\n');
  cm.replaceRange(
    replace(lines).join('\n'),
    { line: fromLine, ch: 0 },
    // @ts-ignore
    { line: toLine }
  );

  cm.focus();
}

export default function gfm(options?: RemarkGfmOptions): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkGfm, options),
    toolbar: {
      left(items) {
        return [
          ...items,
          {
            tooltip: 'task list',
            iconHtml: icon.CheckCorrect({}),
            onClick(cm) {
              handlePrepend(cm, (lines) =>
                lines.map((line) => `- [ ] ${line}`)
              );
            },
          },
          {
            tooltip: 'table',
            iconHtml: icon.InsertTable({}),
            onClick(cm) {
              const pos = cm.getCursor();
              cm.replaceRange(
                `
        |  |  |
        | --- | --- |
        |  |  |
            `,
                pos
              );
              cm.setCursor({ line: pos.line + 1, ch: 2 });
              cm.focus();
            },
          },
        ];
      },
    },
  };
}
