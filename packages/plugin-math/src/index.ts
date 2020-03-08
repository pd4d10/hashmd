import { Plugin } from 'bytemd';
import KatexView from './KatexView.svelte';

const plugin: Plugin = {
  shouldTransformElement(node) {
    return node.type === 'math' || node.type == 'inlineMath';
  },
  component: KatexView
};

export default plugin;
