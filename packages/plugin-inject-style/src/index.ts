import type { BytemdPlugin } from 'bytemd';
import type { Element } from 'hast';

export interface InjectStyleOptions {
  getStyle(data: any): string | undefined;
}

export default function injectStyle({
  getStyle,
}: InjectStyleOptions): BytemdPlugin {
  return {
    rehype: (u) =>
      u.use(() => (tree, file) => {
        const style = getStyle(file.data);
        if (!style) return;

        (tree as Element).children.unshift({
          type: 'element',
          tagName: 'style',
          properties: {},
          children: [
            {
              type: 'text',
              value: style,
            },
          ],
        });
      }),
  };
}
