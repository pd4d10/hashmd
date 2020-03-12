import Xgplayer from './Xgplayer.svelte';
export default function xgplayer() {
    return {
        shouldTransformHtmlElement: function (node) {
            return node.tagName === 'xgplayer';
        },
        component: Xgplayer
    };
}
