import { Plugin, getCodeBlockMeta } from 'bytemd';
import GraphvizView from './GraphvizView.svelte';

export interface BytemdGraphvizOptions {}

export default function graphviz({}: BytemdGraphvizOptions = {}): Plugin {
  return {
    render(node) {
      const meta = getCodeBlockMeta(node);
      if (!meta || meta.language !== 'graphviz') return;

      return {
        component: GraphvizView,
        props: { value: meta.value },
      };
    },
  };
}
