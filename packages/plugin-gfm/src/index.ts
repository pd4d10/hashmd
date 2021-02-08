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
    toolbar: [
      {
        icon: icons.strikethrough,
        onClick({ utils }) {
          utils.wrapText('~~');
        },
        ...locale.strike,
      },
      {
        icon: icons.task,
        onClick({ utils }) {
          utils.replaceLines((lines) => lines.map((line) => '- [ ] ' + line));
        },
        ...locale.task,
      },
      {
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
        ...locale.table,
      },
    ],
  };
}
