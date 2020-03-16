import { Plugin } from 'bytemd';
import MermaidView from './MermaidView.svelte';

export interface BytemdMermaidOptions {}

export default function mermaid({}: BytemdMermaidOptions = {}): Plugin {
  return {
    test(node) {
      return node.type === 'element' && node.tagName === 'md-mermaid';
    },
    component: MermaidView
  };
}
