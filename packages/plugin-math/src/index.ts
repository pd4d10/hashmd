import type { BytemdPlugin } from 'bytemd';
import type * as K from 'katex';
import remarkMath from 'remark-math';
import { icons } from './icons';
import en from './locales/en.json';

export interface BytemdPluginMathOptions {
  locale?: typeof en;
  katexOptions?: Omit<K.KatexOptions, 'displayMode'>;
}

export default function math({
  locale = en,
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
        icon: icons.math,
        children: [
          {
            title: locale.inline,
            icon: icons.inline,
            cheatsheet: `$${locale.inlineText}$`,
            handler({ wrapText, editor }) {
              wrapText('$');
              editor.focus();
            },
          },
          {
            title: locale.block,
            icon: icons.block,
            cheatsheet: `$$↵${locale.blockText}↵$$`,
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
