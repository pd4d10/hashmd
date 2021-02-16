import type { BytemdPlugin } from 'bytemd';
import type { KatexOptions } from 'katex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { icons } from './icons';
import enUS, { Locale } from './locales/en-US';

export interface MathOptions {
  locale?: Locale;
  katexOptions?: Omit<KatexOptions, 'displayMode'>;
}

export default function mathSsr({
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
          const { line } = appendBlock('$$\n\\TeX\n$$');
          editor.setSelection(
            { line: line + 1, ch: 0 },
            { line: line + 1, ch: 4 }
          );
        },
      },
    ],
  };
}
