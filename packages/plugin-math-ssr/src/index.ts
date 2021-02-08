import type { BytemdPlugin } from 'bytemd';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { icons } from './icons';
import enUS, { Locale } from './locales/en-US';

export interface MathOptions {
  locale?: Locale;
  katexOptions?: Omit<katex.KatexOptions, 'displayMode'>;
}

export default function math({
  locale = enUS,
  katexOptions,
}: MathOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
    toolbar: [
      {
        icon: icons.inline,
        onClick({ utils }) {
          utils.wrapText('$');
        },
        ...locale.inline,
      },
      {
        icon: icons.display,
        onClick({ editor, utils }) {
          const { startLine } = utils.appendBlock('$$\n\\TeX\n$$');
          editor.setSelection(
            { line: startLine + 1, ch: 0 },
            { line: startLine + 1, ch: 4 }
          );
        },
        ...locale.display,
      },
    ],
  };
}
