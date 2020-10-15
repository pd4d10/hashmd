import type { BytemdPlugin } from 'bytemd';
import type { Element } from 'hast';
import visit from 'unist-util-visit';

interface AnchorProps {
  target?: string;
  rel?: string;
}

export interface ExternalLinksOptions {
  props?: AnchorProps | ((href: string) => AnchorProps);
}

export default function externalLinks({
  props = {
    target: '_blank',
    rel: 'nofollow noopener noreferrer',
  },
}: ExternalLinksOptions): BytemdPlugin {
  return {
    rehype: (p) =>
      p.use(() => {
        return (tree) => {
          visit<Element>(tree, 'element', (node) => {
            if (node.tagName === 'a' && node.properties?.href) {
              Object.assign(
                node.properties,
                typeof props === 'function'
                  ? props(node.properties.href as string)
                  : props
              );
            }
          });
        };
      }),
  };
}
