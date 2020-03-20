import { Plugin } from 'bytemd';
import Audio from './Audio.svelte';
import Video from './Video.svelte';

export interface PluginOptions {
  videoAttrs?: Partial<HTMLVideoElement>;
  audioAttrs?: Partial<HTMLAudioElement>;
}

export default function media({
  videoAttrs = { controls: true },
  audioAttrs = { controls: true },
}: PluginOptions = {}): Plugin {
  return {
    render(node) {
      if (node.type !== 'element') return;
      switch (node.tagName) {
        case 'video': {
          const {
            src,
            poster,
            width,
            height,
          } = node.properties as HTMLVideoElement;
          return {
            component: Video,
            props: { src, poster, width, height, attrs: videoAttrs },
          };
        }
        case 'audio': {
          return {
            component: Audio,
            props: {
              src: (node.properties as HTMLAudioElement).src,
              attrs: audioAttrs,
            },
          };
        }
      }
    },
  };
}
