import type { BytemdPlugin } from 'bytemd';
import remarkGfm, { RemarkGfmOptions } from 'remark-gfm';
import { CheckCorrect, InsertTable } from '@icon-park/svg';

export default function gfm(options?: RemarkGfmOptions): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkGfm, options),
    toolbar: {
      left(items) {
        return [
          ...items,
          {
            tooltip: 'task list',
            icon: CheckCorrect({}),
            onClick({ editor }) {
              const [selection] = editor.listSelections();
              const fromLine = selection.from().line;
              const toLine = selection.to().line;
              const lines = editor
                // @ts-ignore
                .getRange({ line: fromLine, ch: 0 }, { line: toLine })
                .split('\n');
              editor.replaceRange(
                lines.map((line) => `- [ ] ${line}`).join('\n'),
                { line: fromLine, ch: 0 },
                // @ts-ignore
                { line: toLine }
              );

              editor.focus();
            },
          },
          {
            tooltip: 'table',
            icon: InsertTable({}),
            onClick({ editor }) {
              const pos = editor.getCursor();
              editor.replaceRange(
                `
|  |  |
| --- | --- |
|  |  |
            `,
                pos
              );
              editor.setCursor({ line: pos.line + 1, ch: 2 });
              editor.focus();
            },
          },
        ];
      },
    },
  };
}
