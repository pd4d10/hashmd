import type { Plugin } from 'unified';
import type { Html2mdTransformer } from '@bytemd/plugin-html2md';
import type { Element, Properties } from 'hast';

interface MyElement extends Element {
  properties: Properties & { className?: string[] };
}

export interface FeishuTransformerOptions {
  saveImages(urls: string[]): Promise<string[]>;
}

const rehypeFeishu: Plugin<[FeishuTransformerOptions]> = ({ saveImages }) => {
  return async (tree) => {
    // console.log(tree);
    const { default: visit } = await import('unist-util-visit');

    const imgs: string[] = [];

    visit<MyElement>(tree, 'element', (node, index, parent) => {
      // remove `/` before images
      if (node.properties?.className?.includes('image-loading')) {
        parent?.children.splice(index, 1);
        return;
      }

      // replace h1-h9, pre and code with the correct tagNames
      const mapping: Record<string, string> = {
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
      for (const c of node.properties?.className ?? []) {
        if (mapping[c]) {
          // if (['ol', 'ul'].includes(node.tagName)) {
          //   node.children[0] = {
          //     type: 'element',
          //     tagName: mapping[c],
          //     children: node.children[0]?.children as typeof node.children,
          //   };
          // } else {
          node.tagName = mapping[c];

          if (c === 'inline-code') {
            parent?.children.splice(index - 1, 1);
            parent?.children.splice(index, 1);
          }
          // }
        }
      }

      // collect images
      if (node.tagName === 'img' && typeof node.properties?.src === 'string') {
        imgs.push(node.properties.src);
      }
    });

    // save images then replace
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
): Html2mdTransformer {
  return {
    test: (html) => html.includes('id="magicdomid'),
    rehype: (p) => p.use(rehypeFeishu, options),
  };
}
