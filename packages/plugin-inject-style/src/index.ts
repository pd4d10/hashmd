import type { BytemdPlugin } from 'bytemd';
import type { Element } from 'hast';

export interface InjectStyleOptions {
  style?: string | ((data: any) => string | undefined);
  lazyStyle?(data: any): Promise<string | undefined>;
}

export default function injectStyle({
  style,
  lazyStyle,
}: InjectStyleOptions): BytemdPlugin {
  return {
    rehype: (p) =>
      p.use(() => {
        return (tree, file) => {
          const styleText =
            typeof style === 'function' ? style(file.data) : style;
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
        };
      }),
    viewerEffect({ $el, result }) {
      (async () => {
        const styleText = await lazyStyle?.(result.data);
        if (!styleText) return;

        const $style = document.createElement('style');
        $style.innerHTML = styleText;
        $el.appendChild($style);
      })();
    },
  };
}
