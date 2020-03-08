import { Plugin } from 'bytemd';
import hljs from 'highlight.js';
import Highlight from './Highlight.svelte';

const plugin: Plugin = {
  shouldTransformElement(node) {
    return (
      node.type === 'code' && hljs.getLanguage(node.lang as string) != null
    );
  },
  component: Highlight
};

export default plugin;
