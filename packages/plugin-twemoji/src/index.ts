import { BytemdPlugin } from 'bytemd';
import { parse, ParseObject, ParseCallback } from 'twemoji';
import TwemojiView from './TwemojiView.svelte';

export default function twemoji(
  options: Partial<ParseObject> | ParseCallback
): BytemdPlugin {
  // TODO: options
  return {
    renderNode(node) {
      if (node.type === 'text' && node.value)
        return {
          component: TwemojiView,
          props: {
            raw: parse(node.value as string),
          },
        };
    },
  };
}
