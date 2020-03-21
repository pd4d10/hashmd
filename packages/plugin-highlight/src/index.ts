import { Plugin, getCodeBlockMeta } from 'bytemd';
import lowlight from 'lowlight';
import Highlight from './Highlight.svelte';

export interface PluginOptions {}

export default function highlight({}: PluginOptions = {}): Plugin {
  return {
    render(node) {
      const meta = getCodeBlockMeta(node);
      if (!meta || !meta.language || !lowlight.getLanguage(meta.language))
        return;

      return {
        component: Highlight,
        props: {
          lang: meta.language,
          items: lowlight.highlight(meta.language, meta.value).value,
        },
      };
    },
  };
}
