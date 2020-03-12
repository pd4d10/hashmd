import Xgplayer from './Xgplayer.svelte';
export default function xgplayer() {
    return {
        shouldTransformElement(node) {
            return node.type === 'element' && node.tagName === 'xgplayer';
        },
        component: Xgplayer
    };
}
