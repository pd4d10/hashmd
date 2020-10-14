import type { BytemdPlugin } from 'bytemd';

export default function scrollSync(): BytemdPlugin {
  return {
    editorEffect({ editor, $el }) {
      const $preview = $el.querySelector('.bytemd-preview')!;
      const handleScroll = (cm: CodeMirror.Editor) => {
        requestAnimationFrame(() => {
          const editorInfo = cm.getScrollInfo();
          const ratio =
            editorInfo.top / (editorInfo.height - editorInfo.clientHeight);
          $preview.scrollTo(
            0,
            ratio * ($preview.scrollHeight - $preview.clientHeight)
          );
        });
      };

      editor.on('scroll', handleScroll);
      return () => {
        editor.off('scroll', handleScroll);
      };
    },
  };
}
