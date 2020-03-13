import Xgplayer from './Xgplayer.svelte';
export default function xgplayer() {
    return {
        shouldTransformElement(node) {
            return node.type === 'element' && node.tagName === 'video';
        },
        component: Xgplayer
    };
}
