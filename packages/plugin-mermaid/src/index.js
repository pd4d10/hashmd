import MermaidView from './MermaidView.svelte';
var plugin = {
    shouldTransformElement: function (node) {
        return node.type === 'code' && node.lang === 'mermaid';
    },
    component: MermaidView
};
export default plugin;
