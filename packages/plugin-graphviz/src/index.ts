import { Plugin } from 'bytemd';
import GraphvizView from './GraphvizView.svelte';

export interface BytemdGraphvizOptions {}

export default function graphviz({}: BytemdGraphvizOptions = {}): Plugin {
  return {
    render(node) {
      if (node.type === 'element' && node.tagName === 'md-graphviz') {
        return { component: GraphvizView };
      }
    }
  };
}
