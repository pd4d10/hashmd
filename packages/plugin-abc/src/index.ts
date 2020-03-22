import { Plugin } from 'bytemd';
import Abc from './Abc.svelte';
import { getCodeBlockMeta } from 'bytemd/helpers';

export interface BytemdGraphvizOptions {}

export default function graphviz({}: BytemdGraphvizOptions = {}): Plugin {
  return {
    render(node) {
      const meta = getCodeBlockMeta(node);
      if (!meta || meta.language !== 'abc') return;

      return {
        component: Abc,
        props: { value: meta.value },
      };
    },
  };
}
