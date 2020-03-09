import GraphvizView from './GraphvizView.svelte';
export default function graphviz(_a) {
    _a = {};
    return {
        shouldTransformElement: function (node) {
            return (node.type === 'code' &&
                ['graphviz', 'dot'].includes(node.lang));
        },
        component: GraphvizView
    };
}
