import Xgplayer from './Xgplayer.svelte';
export default function xgplayer() {
    return {
        shouldTransformElement: function (node) {
            return node.type === 'element' && node.tagName === 'xgplayer';
        },
        component: Xgplayer
    };
}
