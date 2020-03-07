import MermaidView from './MermaidView.svelte';

export default {
  transformNode(node) {},
  shouldTransformElement(node) {
    return node.type === 'code' && node.lang === 'mermaid';
  },
  component: MermaidView
};
