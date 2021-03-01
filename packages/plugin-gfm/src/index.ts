import type { BytemdPlugin } from 'bytemd';
import en from './locales/en.json';
import remarkGfm, { RemarkGfmOptions } from 'remark-gfm';
import { icons } from './icons';

export interface BytemdPluginGfmOptions extends RemarkGfmOptions {
  locale?: typeof en;
}

export default function gfm({
  locale = en,
  ...remarkGfmOptions
}: BytemdPluginGfmOptions = {}): BytemdPlugin {
  return {
    remark: (p) => p.use(remarkGfm, remarkGfmOptions),
    action: [
      {
        title: locale.strike,
        icon: icons.strikethrough,
        cheatsheet: `~~${locale.strikeText}~~`,
        handler({ wrapText, editor }) {
          wrapText('~~');
          editor.focus();
        },
      },
      {
        title: locale.task,
        icon: icons.task,
        cheatsheet: `- [ ] ${locale.taskText}`,
        handler({ replaceLines, editor }) {
          replaceLines((line) => '- [ ] ' + line);
          editor.focus();
        },
      },
      {
        title: locale.table,
        icon: icons.table,
        handler({ editor, appendBlock }) {
          const { line } = appendBlock(
            `| ${locale.tableHeading} |  |\n| --- | --- |\n|  |  |\n`
          );
          editor.setSelection(
            { line: line, ch: 2 },
            { line: line, ch: 2 + locale.tableHeading.length }
          );
          editor.focus();
        },
      },
    ],
  };
}
