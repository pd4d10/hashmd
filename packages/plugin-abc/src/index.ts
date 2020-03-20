import { Plugin } from 'bytemd';
import { Node } from 'unist';
import Abc from './Abc.svelte';

export interface BytemdGraphvizOptions {}

export default function graphviz({}: BytemdGraphvizOptions = {}): Plugin {
  return {
    render(node) {
      if (node.type === 'element' && node.tagName === 'md-abc') {
        const children = node.children as Node[];
        if (children[0] && children[0].type === 'text' && children[0].value) {
          return {
            component: Abc,
            props: { value: children[0].value },
          };
        }
      }
    },
  };
}
