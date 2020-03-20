import { Plugin } from 'bytemd';
import { ParseObject, ParseCallback } from 'twemoji';
import TwemojiView from './TwemojiView.svelte';

export default function twemoji(
  options: Partial<ParseObject> | ParseCallback
): Plugin {
  // TODO: options
  return {
    render(node) {
      if (node.type === 'text') return { component: TwemojiView };
    }
  };
}
