import { Plugin } from 'bytemd';
import { Editor } from 'codemirror';
import { IPlayerOptions } from 'xgplayer';
import Xgplayer from './Xgplayer.svelte';
import VideoIcon from './VideoIcon.svelte';

type ClickHandler = (editor: Editor) => void;

export interface PluginOptions {
  tagName?: string;
  playerOptions?: Omit<IPlayerOptions, 'id' | 'el' | 'url'>;
  onClickIcon?: ClickHandler;
}

export default function xgplayer({
  tagName = 'video',
  playerOptions,
  onClickIcon = editor => {
    const pos = editor.getCursor('from');
    editor.replaceRange(`<${tagName} src=""></${tagName}>`, pos);
    editor.setCursor({ line: pos.line, ch: pos.ch + tagName.length + 7 });
    editor.focus();
  },
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
    toolbarItems: [
      {
        component: VideoIcon,
        props: {
          onClick: onClickIcon,
        },
        tooltip: 'video',
      },
    ],
  };
}
