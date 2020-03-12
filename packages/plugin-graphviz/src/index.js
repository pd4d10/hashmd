import GraphvizView from './GraphvizView.svelte';
export default function graphviz({} = {}) {
    return {
        shouldTransformElement(node) {
            return node.type === 'element' && node.tagName === 'graphviz';
        },
        component: GraphvizView
    };
}
