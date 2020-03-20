import { Plugin } from 'bytemd';
import katex from 'katex';
import { Node } from 'unist';
import remarkMath from 'remark-math';
import KatexView from './KatexView.svelte';

export interface BytemdMathOptions {}

export default function math({}: BytemdMathOptions = {}): Plugin {
  return {
    transformer: remarkMath,
    render(node) {
      if (
        node.type === 'element' &&
        Array.isArray((node.properties as any).className) &&
        (node.properties as any).className.includes('math')
      ) {
        const children = node.children as Node[];
        if (children && children[0] && children[0].value) {
          const displayMode = (node.properties as any).className.includes(
            'math-display',
          );
          return {
            component: KatexView,
            props: {
              html: katex.renderToString(children[0].value as string, {
                displayMode,
                throwOnError: false,
              }),
            },
          };
        }
      }
    },
  };
}
