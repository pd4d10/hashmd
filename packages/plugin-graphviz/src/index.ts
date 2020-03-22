import { Plugin } from 'bytemd';
import GraphvizView from './GraphvizView.svelte';
import { getCodeBlockMeta } from 'bytemd/helpers';

export default function graphviz(): Plugin {
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
