import { Plugin } from 'bytemd';
import MermaidView from './MermaidView.svelte';
import { getCodeBlockMeta } from 'bytemd/helpers';

export default function mermaid(): Plugin {
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
