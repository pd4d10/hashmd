import type { BytemdPlugin } from 'bytemd';
import type { Element } from 'hast';
import visit from 'unist-util-visit';

export interface ExternalLinksOptions {
  test?(href: String): boolean;
}

export default function externalLinks({
  test = () => true,
}: ExternalLinksOptions): BytemdPlugin {
  return {
    rehype: (p) =>
      p.use(() => {
        return (tree) => {
          visit<Element>(tree, 'element', (node) => {
            if (
              node.tagName === 'a' &&
              node.properties?.href &&
              test(node.properties.href as string)
            ) {
              node.properties.rel = 'nofollow noopener noreferrer';
              node.properties.target = '_blank';
            }
          });
        };
      }),
  };
}
