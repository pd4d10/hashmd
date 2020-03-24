import { Plugin } from 'bytemd';
import { IPlayerOptions } from 'xgplayer';
import Xgplayer from './Xgplayer.svelte';
import VideoIcon from './VideoIcon.svelte';

type ClickHandler = Exclude<Plugin['toolbarItems'], undefined>[0]['onClick'];

export interface PluginOptions {
  tagName?: string;
  playerOptions?: Omit<IPlayerOptions, 'id' | 'el' | 'url'>;
  onClickIcon?: ClickHandler;
}

export default function xgplayer({
  tagName = 'video',
  playerOptions,
  onClickIcon = cm => {
    const pos = cm.getCursor('from');
    cm.replaceRange(`<${tagName} src=""></${tagName}>`, pos);
    cm.setCursor({ line: pos.line, ch: pos.ch + tagName.length + 7 });
    cm.focus();
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
        onClick: onClickIcon,
        tooltip: 'video',
      },
    ],
  };
}
