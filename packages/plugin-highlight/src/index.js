import Highlight from './Highlight.svelte';

export default {
  transformNode(node) {},
  shouldTransformElement(node) {
    return node.type === 'code' && node.lang;
  },
  component: Highlight
};
