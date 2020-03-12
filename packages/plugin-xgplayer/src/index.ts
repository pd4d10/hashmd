import { Plugin } from 'bytemd';
import Xgplayer from './Xgplayer.svelte';

export default function xgplayer(): Plugin {
  return {
    shouldTransformHtmlElement(node) {
      return node.tagName === 'xgplayer';
    },
    component: Xgplayer
  };
}
