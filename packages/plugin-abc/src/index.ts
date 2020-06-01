import { BytemdPlugin, getCodeBlockMeta } from 'bytemd';
import Abc from './abc.svelte';

export default function graphviz(): BytemdPlugin {
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
