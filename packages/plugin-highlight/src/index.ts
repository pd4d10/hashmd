import { Plugin } from 'bytemd';
import rehypeHighlight from 'rehype-highlight';
import Highlight from './Highlight.svelte';

export interface BytemdHighlightOptions {}

export default function highlight({}: BytemdHighlightOptions = {}): Plugin {
  return {
    transformer: [rehypeHighlight, { subset: false, ignoreMissing: true }],
    render(node) {
      if (node.type === 'element' && node.tagName === 'code') {
        return {
          component: Highlight,
          props: { node },
        };
      }
    },
  };
}
