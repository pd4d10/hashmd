import hljs from 'highlight.js';
import Highlight from './Highlight.svelte';
var plugin = {
    shouldTransformElement: function (node) {
        return (node.type === 'code' && hljs.getLanguage(node.lang) != null);
    },
    component: Highlight
};
export default plugin;
