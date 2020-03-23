import { Plugin } from 'bytemd';
import Abc from './Abc.svelte';
import { getCodeBlockMeta } from 'bytemd/helpers';

export default function graphviz(): Plugin {
  return {
    renderNode(node) {
      const meta = getCodeBlockMeta(node);
      if (!meta || meta.language !== 'abc') return;

      return {
        component: Abc,
        props: { value: meta.value },
      };
    },
  };
}
