import type { BytemdPlugin } from 'bytemd';
import type { Element } from 'hast';

type Data = Record<string, any>;

export interface InjectStyleOptions {
  style?: string | ((data: Data) => string | undefined);
  lazyStyle?(data: Data): Promise<string | undefined>;
}

export default function injectStyle({
  style,
  lazyStyle,
}: InjectStyleOptions): BytemdPlugin {
  return {
    rehype: (p) =>
      p.use(() => (tree, file) => {
        const styleText =
          typeof style === 'function' ? style(file.data as Data) : style;
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
        const styleText = await lazyStyle?.(result.data as Data);
        if (!styleText) return;

        const $style = document.createElement('style');
        $style.innerHTML = styleText;
        $el.appendChild($style);
      })();
    },
  };
}
