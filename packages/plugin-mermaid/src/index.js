import MermaidView from './MermaidView.svelte';
export default function mermaid({} = {}) {
    return {
        test(node) {
            return node.type === 'element' && node.tagName === 'mermaid';
        },
        component: MermaidView
    };
}
