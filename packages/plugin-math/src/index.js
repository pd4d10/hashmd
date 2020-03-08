import KatexView from './KatexView.svelte';
var plugin = {
    shouldTransformElement: function (node) {
        return node.type === 'math' || node.type == 'inlineMath';
    },
    component: KatexView
};
export default plugin;
