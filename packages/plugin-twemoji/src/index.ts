import { Plugin } from 'bytemd';
import { ParseObject, ParseCallback } from 'twemoji';
import TwemojiView from './TwemojiView.svelte';

export default function twemoji(
  options: Partial<ParseObject> | ParseCallback
): Plugin {
  // TODO: options
  return {
    shouldTransformElement(node) {
      return node.type === 'text';
    },
    component: TwemojiView
  };
}
