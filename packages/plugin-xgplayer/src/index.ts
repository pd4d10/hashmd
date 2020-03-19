import { Plugin } from 'bytemd';
import Xgplayer from './Xgplayer.svelte';

export default function xgplayer(): Plugin {
  return {
    test(node) {
      return node.type === 'element' && node.tagName === 'video';
    },
    component: Xgplayer
  };
}
