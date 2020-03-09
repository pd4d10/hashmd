import hljs from 'highlight.js';
import Highlight from './Highlight.svelte';
export default function highlight(_a) {
    return {
        shouldTransformElement: function (node) {
            return (node.type === 'code' && hljs.getLanguage(node.lang) != null);
        },
        component: Highlight
    };
}
