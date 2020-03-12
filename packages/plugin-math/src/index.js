import KatexView from './KatexView.svelte';
export default function math({} = {}) {
    return {
        shouldTransformElement(node) {
            return node.type === 'math' || node.type == 'inlineMath';
        },
        component: KatexView
    };
}
