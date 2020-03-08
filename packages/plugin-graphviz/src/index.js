import GraphvizView from './GraphvizView.svelte';
var plugin = {
    shouldTransformElement: function (node) {
        return (node.type === 'code' && ['graphviz', 'dot'].includes(node.lang));
    },
    component: GraphvizView
};
export default plugin;
