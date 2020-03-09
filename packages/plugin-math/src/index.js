import KatexView from './KatexView.svelte';
export default function math(_a) {
    _a = {};
    return {
        shouldTransformElement: function (node) {
            return node.type === 'math' || node.type == 'inlineMath';
        },
        component: KatexView
    };
}
