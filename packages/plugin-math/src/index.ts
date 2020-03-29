import { Plugin } from 'bytemd';
import remarkMath from 'remark-math';
import Katex from './katex.svelte';

export default function math(): Plugin {
  return {
    transformer: remarkMath,
    renderNode(node) {
      if (
        !node.tagName ||
        !node.properties.className ||
        !node.properties.className.includes('math')
      )
        return;

      const textNode = node.children[0];
      if (!textNode || !textNode.value) return;

      const displayMode = node.properties.className.includes('math-display');
      return {
        component: Katex,
        props: {
          displayMode,
          text: textNode.value,
        },
      };
    },
  };
}
