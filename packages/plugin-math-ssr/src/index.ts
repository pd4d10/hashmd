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
    action: [
      {
        ...locale.inline,
        icon: icons.inline,
      },
      {
        ...locale.display,
        icon: icons.display,
        handler({ editor, appendBlock }) {
          const { startLine } = appendBlock('$$\n\\TeX\n$$');
          editor.setSelection(
            { line: startLine + 1, ch: 0 },
            { line: startLine + 1, ch: 4 }
          );
        },
      },
    ],
  };
}
