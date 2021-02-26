import type { BytemdPlugin } from 'bytemd';
import type * as K from 'katex';
import remarkMath from 'remark-math';
import { icons } from './icons';
import enUS, { Locale } from './locales/en-US';

export interface BytemdPluginMathOptions {
  locale?: Locale;
  katexOptions?: Omit<K.KatexOptions, 'displayMode'>;
}

export default function math({
  locale = enUS,
  katexOptions,
}: BytemdPluginMathOptions = {}): BytemdPlugin {
  let katex: typeof K;

  return {
    remark: (p) => p.use(remarkMath),
    viewerEffect({ markdownBody }) {
      const renderMath = async (selector: string, displayMode: boolean) => {
        const els = markdownBody.querySelectorAll<HTMLElement>(selector);
        if (els.length === 0) return;

        if (!katex) {
          katex = await import('katex');
        }

        els.forEach((el) => {
          katex.render(el.innerText, el, {
            ...katexOptions,
            throwOnError: false,
            displayMode,
          });
        });
      };

      renderMath('.math.math-inline', false);
      renderMath('.math.math-display', true);
    },
    action: [
      {
        title: locale.formula,
        icon: icons.math,
        children: [
          {
            ...locale.inline,
            icon: icons.inline,
            handler({ wrapText, editor }) {
              wrapText('$');
              editor.focus();
            },
          },
          {
            ...locale.block,
            icon: icons.block,
            handler({ appendBlock, editor }) {
              const { line } = appendBlock('$$\n\\TeX\n$$');
              editor.setSelection(
                { line: line + 1, ch: 0 },
                { line: line + 1, ch: 4 }
              );
              editor.focus();
            },
          },
        ],
      },
    ],
  };
}
