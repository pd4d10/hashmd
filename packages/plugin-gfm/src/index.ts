import type { BytemdPlugin } from 'bytemd';
import remarkGfm, { RemarkGfmOptions } from 'remark-gfm';
import { icons } from './icons';

export default function gfm(options?: RemarkGfmOptions): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkGfm, options),
    toolbar: {
      task: {
        tooltip: 'Task list',
        icon: icons.task,
        onClick({ utils }) {
          utils.replaceLines((lines) => lines.map((line) => '- [ ] ' + line));
        },
      },
      table: {
        tooltip: 'Table',
        icon: icons.table,
        onClick({ editor, utils }) {
          const { startLine } = utils.appendBlock(
            '| heading |  |\n| --- | --- |\n|  |  |\n'
          );
          editor.setSelection(
            { line: startLine, ch: 2 },
            { line: startLine, ch: 9 }
          );
        },
      },
    },
  };
}
