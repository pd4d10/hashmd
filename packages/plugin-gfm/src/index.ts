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
        handler({ wrapText, editor }) {
          wrapText('~~');
          editor.focus();
        },
      },
      {
        ...locale.task,
        icon: icons.task,
        handler({ replaceLines, editor }) {
          replaceLines((line) => '- [ ] ' + line);
          editor.focus();
        },
      },
      {
        ...locale.table,
        icon: icons.table,
        handler({ editor, appendBlock }) {
          const { line } = appendBlock(
            '| heading |  |\n| --- | --- |\n|  |  |\n'
          );
          editor.setSelection({ line: line, ch: 2 }, { line: line, ch: 9 });
          editor.focus();
        },
      },
    ],
  };
}
