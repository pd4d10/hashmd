import { Plugin } from 'bytemd';
import rehypeHighlight from 'rehype-highlight';
import Highlight from './Highlight.svelte';

export interface BytemdHighlightOptions {}

export default function highlight({}: BytemdHighlightOptions = {}): Plugin {
  return {
    transformer: [rehypeHighlight, { subset: false, ignoreMissing: true }],
    test(node) {
      return node.type === 'element' && node.tagName === 'code';
    },
    component: Highlight
  };
}
