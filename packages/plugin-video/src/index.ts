import { Plugin } from 'bytemd';
import Video from './Video.svelte';

export default function xgplayer(): Plugin {
  return {
    test(node) {
      return node.type === 'element' && node.tagName === 'video';
    },
    component: Video
  };
}
