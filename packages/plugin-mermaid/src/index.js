import MermaidView from './MermaidView.svelte';
export default function mermaid({} = {}) {
    return {
        shouldTransformElement(node) {
            return node.type === 'element' && node.tagName === 'mermaid';
        },
        component: MermaidView
    };
}
