import PlantumlView from './PlantumlView.svelte';
export default function plantuml(_a) {
    _a = {};
    return {
        shouldTransformElement: function (node) {
            return node.type === 'code' && node.lang === 'plantuml';
        },
        component: PlantumlView
    };
}
