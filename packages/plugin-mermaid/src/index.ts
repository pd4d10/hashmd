import { createCodeBlockPlugin } from 'bytemd';
import MermaidView from './mermaid.svelte';

export default function mermaid() {
  return createCodeBlockPlugin({
    language: ['mermaid'],
    component: MermaidView,
  });
}
