import { Plugin } from 'bytemd';
import MediaView from './MediaView.svelte';

export default function media(): Plugin {
  return {
    render(node) {
      if (
        node.type === 'element' &&
        (node.tagName === 'video' || node.tagName === 'audio')
      )
        return { component: MediaView };
    }
  };
}
