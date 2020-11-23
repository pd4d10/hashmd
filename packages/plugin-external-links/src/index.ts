import type { BytemdPlugin } from 'bytemd';
import type { Element } from 'hast';
import visit from 'unist-util-visit';

type AnchorProps = Partial<Omit<HTMLAnchorElement, 'href'>>;

export interface ExternalLinksOptions {
  /**
   * Test if it is an external url
   */
  test(href: string): boolean;
  /**
   * Internal links props
   */
  internalProps?: AnchorProps;
  /**
   * External links props
   */
  externalProps?: AnchorProps;
}

export default function externalLinks({
  test,
  internalProps = {},
  externalProps = {
    target: '_blank',
    rel: 'nofollow noopener noreferrer',
  },
}: ExternalLinksOptions): BytemdPlugin {
  return {
    rehype: (p) =>
      p.use(() => (tree) => {
        visit<Element>(tree, 'element', (node) => {
          if (node.tagName !== 'a' || !node.properties?.href) return;

          const href = node.properties.href as string;
          if (!/https?:\/\//.test(href)) return; // only handle http and https

          Object.assign(
            node.properties,
            test(href) ? externalProps : internalProps
          );
        });
      }),
  };
}
