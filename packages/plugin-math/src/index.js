import KatexView from './KatexView.svelte';
export default function math({} = {}) {
    return {
        test(node) {
            return node.type === 'math' || node.type == 'inlineMath';
        },
        component: KatexView
    };
}
