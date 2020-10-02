import type { Plugin } from 'unified';
import type { ImportHtmlTransformer } from '@bytemd/plugin-import-html';
import type { Element, Text } from 'hast';

declare module 'hast' {
  interface Properties {
    className?: string[];
  }
}

export interface FeishuTransformerOptions {
  saveImages(urls: string[]): Promise<string[]>;
}

const rehypeFeishu: Plugin<[FeishuTransformerOptions]> = ({ saveImages }) => {
  return async (tree) => {
    const { default: visit } = await import('unist-util-visit');

    // remove `/` before images
    visit<Element>(tree, 'element', (node, index, parent) => {
      if (node.properties?.className?.includes('image-loading')) {
        parent?.children.splice(index, 1);
      }
    });

    // replace with the correct tag names
    visit<Element>(tree, 'element', (node) => {
      const tagMap: Record<string, string> = {
        'heading-h1': 'h1',
        'heading-h2': 'h2',
        'heading-h3': 'h3',
        'heading-h4': 'h4',
        'heading-h5': 'h5',
        'heading-h6': 'h6',
        'heading-h7': 'h6',
        'heading-h8': 'h6',
        'heading-h9': 'h6',
        'list-code': 'pre',
        'inline-code': 'code',
      };
      node.properties?.className?.forEach((c) => {
        if (tagMap[c]) node.tagName = tagMap[c];
      });
    });

    // ul>li,ul -> ul>li>ul
    visit<Element>(tree, 'element', (node, index, parent) => {
      if (parent && node.tagName === 'li') {
        const next = parent.children[index + 1] as
          | Element['children'][0]
          | undefined;
        if (next?.tagName === 'ol' || next?.tagName === 'ul') {
          node.children.push(next);
          parent.children.splice(index + 1, 1);
        }
      }
    });

    // (pre>code)*n -> pre>(code*n)
    visit<Element>(tree, 'element', (node, index, parent) => {
      if (parent && node.tagName === 'pre') {
        let next: Element['children'][0] | undefined;

        do {
          next = parent.children[index + 1] as any;
          if (next?.type === 'element') {
            node.children.push(
              { type: 'element', tagName: 'br', children: [] },
              ...next.children
            );
          }
          parent.children.splice(index + 1, 1);
        } while (next?.type === 'element' && next?.tagName === 'pre');
      }
    });

    visit<Text>(tree, 'text', (node) => {
      node.value = node.value.replace(/[\u2022\u200b]/, '');
    });

    // collect and replace images
    const imgs: string[] = [];
    visit<Element>(tree, 'element', (node) => {
      if (node.tagName === 'img' && typeof node.properties?.src === 'string') {
        imgs.push(node.properties.src);
      }
    });
    const newImgs = await saveImages(imgs);
    visit<Element>(tree, 'element', (node) => {
      if (node.tagName === 'img' && typeof node.properties?.src === 'string') {
        const src = node.properties.src;
        const index = newImgs.findIndex((url) => url === src);
        node.properties.src = newImgs[index];
      }
    });
  };
};

export default function feishuTransformer(
  options: FeishuTransformerOptions
): ImportHtmlTransformer {
  return {
    test: (html) => html.includes('id="magicdomid'),
    rehype: (p) => p.use(rehypeFeishu, options),
  };
}
