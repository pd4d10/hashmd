import hljs from 'highlight.js';
import Highlight from './Highlight.svelte';
export default function highlight({} = {}) {
    return {
        test(node) {
            return (node.type === 'code' && hljs.getLanguage(node.lang) != null);
        },
        component: Highlight
    };
}
