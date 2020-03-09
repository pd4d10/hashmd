import { Plugin } from 'bytemd';
import MermaidView from './MermaidView.svelte';

export interface BytemdMermaidOptions {}

export default function mermaid({}: BytemdMermaidOptions = {}): Plugin {
  return {
    shouldTransformElement(node) {
      return node.type === 'code' && node.lang === 'mermaid';
    },
    component: MermaidView
  };
}
