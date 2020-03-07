import hljs from 'highlight.js';
import Highlight from './Highlight.svelte';

export default {
  transformNode(node) {},
  shouldTransformElement(node) {
    return node.type === 'code' && hljs.getLanguage(node.lang);
  },
  component: Highlight
};
