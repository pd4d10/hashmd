import { BytemdPlugin } from 'bytemd';
import MermaidView from './mermaid.svelte';
import { getCodeBlockMeta } from 'bytemd/helpers';

export default function mermaid(): BytemdPlugin {
  return {
    renderNode(node) {
      const meta = getCodeBlockMeta(node);
      if (!meta || meta.language !== 'mermaid') return;

      return {
        component: MermaidView,
        props: { value: meta.value },
      };
    },
  };
}
