import { Plugin, getCodeBlockMeta } from 'bytemd';
import Abc from './Abc.svelte';

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
