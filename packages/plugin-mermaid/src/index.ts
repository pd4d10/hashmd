import { Plugin } from 'bytemd';
import MermaidView from './MermaidView.svelte';

const plugin: Plugin = {
  shouldTransformElement(node) {
    return node.type === 'code' && node.lang === 'mermaid';
  },
  component: MermaidView
};

export default plugin;
