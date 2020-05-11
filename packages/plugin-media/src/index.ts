import { Plugin } from 'bytemd';
import { Editor } from 'codemirror';
import Audio from './Audio.svelte';
import Video from './Video.svelte';
import AudioIcon from './AudioIcon.svelte';
import VideoIcon from './VideoIcon.svelte';

type ClickHandler = (editor: Editor) => void;

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
  return (editor) => {
    const pos = editor.getCursor('from');
    editor.replaceRange(`<${type} src=""></${type}>`, pos);
    editor.setCursor({ line: pos.line, ch: pos.ch + 12 });
    editor.focus();
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
        props: { onClick: onClickAudio },
        tooltip: 'audio',
      },
      {
        component: VideoIcon,
        props: { onClick: onClickVideo },
        tooltip: 'video',
      },
    ],
  };
}
