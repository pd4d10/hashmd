import { Plugin } from 'bytemd';
import Audio from './Audio.svelte';
import Video from './Video.svelte';

export default function media(): Plugin {
  return {
    render(node) {
      if (node.type !== 'element') return;
      switch (node.tagNam) {
        case 'video': {
          const {
            src,
            poster,
            width,
            height
          } = node.properties as HTMLVideoElement;
          return {
            component: Video,
            props: { src, poster, width, height }
          };
        }
        case 'audio': {
          return {
            component: Audio,
            props: { src: (node.properties as HTMLAudioElement).src }
          };
        }
      }
    }
  };
}
