import MermaidView from './MermaidView.svelte';
export default function mermaid(_a) {
    _a = {};
    return {
        shouldTransformElement: function (node) {
            return node.type === 'code' && node.lang === 'mermaid';
        },
        component: MermaidView
    };
}
