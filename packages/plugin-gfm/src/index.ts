import type { BytemdPlugin } from 'bytemd';
import enUS, { Locale } from './locales/en-US';
import remarkGfm, { RemarkGfmOptions } from 'remark-gfm';
import { icons } from './icons';

export interface BytemdPluginGfmOptions {
  locale?: Locale;
  remarkGfmOptions?: RemarkGfmOptions;
}

export default function gfm({
  locale = enUS,
  remarkGfmOptions,
}: BytemdPluginGfmOptions = {}): BytemdPlugin {
  return {
    remark: (p) => p.use(remarkGfm, remarkGfmOptions),
    action: [
      {
        ...locale.strike,
        icon: icons.strikethrough,
        handler({ wrapText }) {
          wrapText('~~');
        },
      },
      {
        ...locale.task,
        icon: icons.task,
        handler({ replaceLines }) {
          replaceLines((lines) => lines.map((line) => '- [ ] ' + line));
        },
      },
      {
        ...locale.table,
        icon: icons.table,
        handler({ editor, appendBlock }) {
          const { startLine } = appendBlock(
            '| heading |  |\n| --- | --- |\n|  |  |\n'
          );
          editor.setSelection(
            { line: startLine, ch: 2 },
            { line: startLine, ch: 9 }
          );
        },
      },
    ],
  };
}
