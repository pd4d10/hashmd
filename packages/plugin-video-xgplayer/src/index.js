import Xgplayer from './Xgplayer.svelte';
export default function xgplayer() {
    return {
        test(node) {
            return node.type === 'element' && node.tagName === 'video';
        },
        component: Xgplayer
    };
}
