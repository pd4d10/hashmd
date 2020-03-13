import Video from './Video.svelte';
export default function xgplayer() {
    return {
        shouldTransformElement(node) {
            return node.type === 'element' && node.tagName === 'video';
        },
        component: Video
    };
}
