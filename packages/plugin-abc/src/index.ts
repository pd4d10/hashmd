import { Plugin } from 'bytemd';
import Abc from './Abc.svelte';

export interface BytemdGraphvizOptions {}

export default function graphviz({}: BytemdGraphvizOptions = {}): Plugin {
  return {
    test(node) {
      return node.type === 'element' && node.tagName === 'md-abc';
    },
    component: Abc
  };
}
