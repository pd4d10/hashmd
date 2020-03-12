import GraphvizView from './GraphvizView.svelte';
export default function graphviz({} = {}) {
    return {
        shouldTransformElement(node) {
            return (node.type === 'code' &&
                ['graphviz', 'dot'].includes(node.lang));
        },
        component: GraphvizView
    };
}
