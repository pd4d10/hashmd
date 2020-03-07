import Katex from './Katex.svelte';

export default {
  transformNode(node) {},
  shouldTransformElement(node) {
    return node.type === 'math' || node.type == 'inlineMath';
  },
  component: Katex
};
