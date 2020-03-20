import { Plugin } from 'bytemd';
import Xgplayer from './Xgplayer.svelte';

export default function xgplayer(): Plugin {
  return {
    render(node) {
      if (node.type === 'element' && node.tagName === 'video') {
        const {
          src,
          poster,
          width,
          height
        } = node.properties as HTMLVideoElement;
        return {
          component: Xgplayer,
          props: { src, poster, width, height }
        };
      }
    }
  };
}
