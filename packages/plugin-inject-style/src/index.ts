import type { BytemdPlugin } from 'bytemd';
import type { Element } from 'hast';
import type { VFile } from 'vfile';

export interface InjectStyleOptions {
  style?: string | ((file: VFile) => string | undefined);
  lazyStyle?(file: VFile): Promise<string | undefined>;
}

export default function injectStyle({
  style,
  lazyStyle,
}: InjectStyleOptions): BytemdPlugin {
  return {
    rehype: (p) =>
      p.use(() => (tree, file) => {
        const styleText = typeof style === 'function' ? style(file) : style;
        if (!styleText) return;

        (tree as Element).children.unshift({
          type: 'element',
          tagName: 'style',
          properties: {},
          children: [
            {
              type: 'text',
              value: styleText,
            },
          ],
        });
      }),
    viewerEffect({ $el, result }) {
      (async () => {
        const styleText = await lazyStyle?.(result);
        if (!styleText) return;

        const $style = document.createElement('style');
        $style.innerHTML = styleText;
        $el.appendChild($style);
      })();
    },
  };
}
