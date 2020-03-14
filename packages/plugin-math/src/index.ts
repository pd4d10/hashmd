import { Plugin } from 'bytemd';
import KatexView from './KatexView.svelte';

export interface BytemdMathOptions {}

export default function math({}: BytemdMathOptions = {}): Plugin {
  return {
    test(node) {
      return (
        node.type === 'element' &&
        Array.isArray((node.properties as any).className) &&
        (node.properties as any).className.includes('math')
      );
    },
    component: KatexView
  };
}
