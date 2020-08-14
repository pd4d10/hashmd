import { BytemdPlugin } from 'bytemd';
// @ts-ignore
import remarkMath from 'remark-math';
import { KatexOptions } from 'katex';

export interface MathLazyOptions {
  inlineMathDouble?: boolean;
  katexOptions?: Omit<KatexOptions, 'displayMode'>;
}

export default function mathLazy({
  inlineMathDouble,
  katexOptions,
}: MathLazyOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath, { inlineMathDouble }),
    viewerEffect(el) {
      const renderInline = async () => {
        const els = el.querySelectorAll<HTMLElement>(
          '.math.math-inline:not(.math-display)' // for `inlineMathDouble === true` case
        );
        if (els.length === 0) return;

        const { render } = await import('katex');
        els.forEach((el) => {
          render(el.innerText, el, {
            ...katexOptions,
            throwOnError: false,
            displayMode: false,
          });
        });
      };

      const renderDisplay = async () => {
        const els = el.querySelectorAll<HTMLElement>('.math.math-display');
        if (els.length === 0) return;

        const { render } = await import('katex');
        els.forEach((el) => {
          render(el.innerText, el, {
            ...katexOptions,
            throwOnError: false,
            displayMode: true,
          });
        });
      };

      renderInline();
      renderDisplay();
    },
  };
}
