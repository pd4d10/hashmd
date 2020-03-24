import { Plugin } from 'bytemd';
import Audio from './Audio.svelte';
import Video from './Video.svelte';
import AudioIcon from './AudioIcon.svelte';
import VideoIcon from './VideoIcon.svelte';

type ClickHandler = Exclude<Plugin['toolbarItems'], undefined>[0]['onClick'];

export interface PluginOptions {
  video?: {
    defaultAttrs?: Partial<HTMLVideoElement>;
    onClickIcon?: ClickHandler;
  };
  audio?: {
    defaultAttrs?: Partial<HTMLAudioElement>;
    onClickIcon?: ClickHandler;
  };
}

function getClickHandler(type: string): ClickHandler {
  return cm => {
    const pos = cm.getCursor('from');
    cm.replaceRange(`<${type} src=""></${type}>`, pos);
    cm.setCursor({ line: pos.line, ch: pos.ch + 12 });
    cm.focus();
  };
}

export default function media({
  video: {
    defaultAttrs: videoAttrs = { controls: true },
    onClickIcon: onClickVideo = getClickHandler('video'),
  } = {},
  audio: {
    defaultAttrs: audioAttrs = { controls: true },
    onClickIcon: onClickAudio = getClickHandler('audio'),
  } = {},
}: PluginOptions = {}): Plugin {
  return {
    renderNode(node) {
      if (node.type !== 'element') return;
      switch (node.tagName) {
        case 'video': {
          const { src, poster, width, height } = node.properties;
          return {
            component: Video,
            props: { src, poster, width, height, attrs: videoAttrs },
          };
        }
        case 'audio': {
          return {
            component: Audio,
            props: {
              src: node.properties.src,
              attrs: audioAttrs,
            },
          };
        }
      }
    },
    toolbarItems: [
      {
        component: AudioIcon,
        onClick: onClickAudio,
        tooltip: 'audio',
      },
      {
        component: VideoIcon,
        onClick: onClickVideo,
        tooltip: 'video',
      },
    ],
  };
}
