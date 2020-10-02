import type { BytemdPlugin } from 'bytemd';

export default function scrollSync(): BytemdPlugin {
  return {
    editorEffect(cm, el) {
      const viewer = el.querySelector('.bytemd-preview')!;
      const handleScroll = (cm: CodeMirror.Editor) => {
        requestAnimationFrame(() => {
          const editorInfo = cm.getScrollInfo();
          const ratio =
            editorInfo.top / (editorInfo.height - editorInfo.clientHeight);
          viewer.scrollTo(
            0,
            ratio * (viewer.scrollHeight - viewer.clientHeight)
          );
        });
      };

      cm.on('scroll', handleScroll);
      return () => {
        cm.off('scroll', handleScroll);
      };
    },
  };
}
