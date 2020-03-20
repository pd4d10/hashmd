import { Plugin } from 'bytemd';
import Xgplayer from './Xgplayer.svelte';

export default function xgplayer(): Plugin {
  return {
    render(node) {
      if (node.type === 'element' && node.tagName === 'video')
        return { component: Xgplayer };
    }
  };
}
