import { Plugin } from 'bytemd';
import KatexView from './KatexView.svelte';

export interface BytemdMathOptions {}

export default function math({}: BytemdMathOptions = {}): Plugin {
  return {
    shouldTransformElement(node) {
      return node.type === 'math' || node.type == 'inlineMath';
    },
    component: KatexView
  };
}
