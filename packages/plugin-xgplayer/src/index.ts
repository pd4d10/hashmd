import { Plugin } from 'bytemd';
import { IPlayerOptions } from 'xgplayer';
import Xgplayer from './Xgplayer.svelte';

export interface PluginOptions {
  tagName?: string;
  playerOptions?: Omit<IPlayerOptions, 'id' | 'el' | 'url'>;
}

export default function xgplayer({
  tagName = 'video',
  playerOptions,
}: PluginOptions = {}): Plugin {
  return {
    renderNode(node) {
      if (node.type === 'element' && node.tagName === tagName) {
        const { src, poster, width, height } = node.properties;
        return {
          component: Xgplayer,
          props: {
            url: src,
            poster,
            width,
            height,
            playerOptions,
          },
        };
      }
    },
  };
}
