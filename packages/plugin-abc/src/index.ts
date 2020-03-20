import { Plugin } from 'bytemd';
import Abc from './Abc.svelte';

export interface BytemdGraphvizOptions {}

export default function graphviz({}: BytemdGraphvizOptions = {}): Plugin {
  return {
    render(node) {
      if (node.type === 'element' && node.tagName === 'md-abc') {
        return { component: Abc };
      }
    }
  };
}
