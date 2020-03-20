import { Plugin } from 'bytemd';
import { Node } from 'unist';
import MermaidView from './MermaidView.svelte';

export interface BytemdMermaidOptions {}

export default function mermaid({}: BytemdMermaidOptions = {}): Plugin {
  return {
    render(node) {
      if (node.type === 'element' && node.tagName === 'md-mermaid') {
        const children = node.children as Node[];
        if (children && children[0] && children[0].value)
          return {
            component: MermaidView,
            props: { value: children[0].value },
          };
      }
    },
  };
}
