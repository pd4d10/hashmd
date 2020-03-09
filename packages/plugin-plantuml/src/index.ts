import { Plugin } from 'bytemd';
import PlantumlView from './PlantumlView.svelte';

export interface BytemdPlantumlOptions {}

export default function plantuml({}: BytemdPlantumlOptions = {}): Plugin {
  return {
    shouldTransformElement(node) {
      return node.type === 'code' && node.lang === 'plantuml';
    },
    component: PlantumlView
  };
}
