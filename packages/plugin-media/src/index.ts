import { Plugin } from 'bytemd';
import MediaView from './MediaView.svelte';

export default function media(): Plugin {
  return {
    test(node) {
      return (
        node.type === 'element' &&
        (node.tagName === 'video' || node.tagName === 'audio')
      );
    },
    component: MediaView
  };
}
