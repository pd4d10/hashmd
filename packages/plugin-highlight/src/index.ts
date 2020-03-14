import { Plugin } from 'bytemd';
import hljs from 'highlight.js';
import Highlight from './Highlight.svelte';

export interface BytemdHighlightOptions {}

export default function highlight({}: BytemdHighlightOptions = {}): Plugin {
  return {
    test(node) {
      return (
        node.tagName === 'code' && hljs.getLanguage(node.lang as string) != null
      );
    },
    component: Highlight
  };
}
