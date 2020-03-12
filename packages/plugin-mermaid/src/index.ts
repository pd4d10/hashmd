import { Plugin } from 'bytemd';
import MermaidView from './MermaidView.svelte';

export interface BytemdMermaidOptions {}

export default function mermaid({}: BytemdMermaidOptions = {}): Plugin {
  return {
    shouldTransformElement(node) {
      return node.type === 'element' && node.tagName === 'mermaid';
    },
    component: MermaidView
  };
}
