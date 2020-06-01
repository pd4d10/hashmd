import { BytemdPlugin, getCodeBlockMeta } from 'bytemd';
import lowlight from 'lowlight';
import Highlight from './highlight.svelte';

declare module 'lowlight' {
  export function getLanguage(lang: string): any;
}

export default function highlight(): BytemdPlugin {
  return {
    renderNode(node) {
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
