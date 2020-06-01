import { createCodeBlockPlugin } from 'bytemd';
import AbcView from './abc.svelte';

export default function abc() {
  return createCodeBlockPlugin({
    language: ['abc'],
    component: AbcView,
  });
}
