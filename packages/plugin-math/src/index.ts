import type { BytemdPlugin } from 'bytemd';
import type * as K from 'katex';
import remarkMath from 'remark-math';
import { icons } from './icons';

export interface MathOptions {
  katexOptions?: Omit<K.KatexOptions, 'displayMode'>;
}

export default function math({ katexOptions }: MathOptions = {}): BytemdPlugin {
  let katex: typeof K;

  return {
    remark: (p) => p.use(remarkMath),
    viewerEffect({ $el }) {
      const renderMath = async (selector: string, displayMode: boolean) => {
        const els = $el.querySelectorAll<HTMLElement>(selector);
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
    toolbar: {
      math: {
        tooltip: 'Math formula',
        icon: icons.formula,
        onClick({ editor, utils }) {
          const { startLine } = utils.appendBlock('$$\n\\TeX\n$$');
          editor.setSelection(
            { line: startLine + 1, ch: 0 },
            { line: startLine + 1, ch: 4 }
          );
        },
      },
    },
  };
}
