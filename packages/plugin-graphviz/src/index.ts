import { Plugin } from 'bytemd';
import { Node } from 'unist';
import GraphvizView from './GraphvizView.svelte';

export interface BytemdGraphvizOptions {}

export default function graphviz({}: BytemdGraphvizOptions = {}): Plugin {
  return {
    render(node) {
      if (node.type === 'element' && node.tagName === 'md-graphviz') {
        const children = node.children as Node[];
        if (children[0] && children[0].type === 'text' && children[0].value) {
          return {
            component: GraphvizView,
            props: { value: children[0].value }
          };
        }
      }
    }
  };
}
