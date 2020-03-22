import { Plugin } from 'bytemd';
import GraphvizView from './GraphvizView.svelte';
import { getCodeBlockMeta } from 'bytemd/helpers';

export interface BytemdGraphvizOptions {}

export default function graphviz({}: BytemdGraphvizOptions = {}): Plugin {
  return {
    render(node) {
      const meta = getCodeBlockMeta(node);
      if (
        !(meta && meta.language && ['graphviz', 'dot'].includes(meta.language))
      )
        return;

      return {
        component: GraphvizView,
        props: { value: meta.value },
      };
    },
  };
}
