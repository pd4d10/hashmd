import Video from './Video.svelte';
export default function xgplayer() {
    return {
        test(node) {
            return node.type === 'element' && node.tagName === 'video';
        },
        component: Video
    };
}
