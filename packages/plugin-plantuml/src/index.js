import PlantumlView from './PlantumlView.svelte';
export default function plantuml({} = {}) {
    return {
        shouldTransformElement(node) {
            return node.type === 'code' && node.lang === 'plantuml';
        },
        component: PlantumlView
    };
}
