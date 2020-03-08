import { Plugin } from 'bytemd';
import GraphvizView from './GraphvizView.svelte';

const plugin: Plugin = {
  shouldTransformElement(node) {
    return (
      node.type === 'code' && ['graphviz', 'dot'].includes(node.lang as string)
    );
  },
  component: GraphvizView
};

export default plugin;
