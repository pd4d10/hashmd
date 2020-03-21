import { Plugin } from 'bytemd';
import lowlight from 'lowlight';
import Highlight from './Highlight.svelte';

export interface PluginOptions {}

export default function highlight({}: PluginOptions = {}): Plugin {
  return {
    render(node) {
      if (node.tagName !== 'code' || !node.properties.className) return;

      const lang = node.properties.className[0].split('-')[1];
      if (!lang || !lowlight.getLanguage(lang)) return;

      const textNode = node.children[0];
      if (!textNode) return;

      return {
        component: Highlight,
        props: {
          lang,
          items: lowlight.highlight(lang, textNode.value as string).value,
        },
      };
    },
  };
}
