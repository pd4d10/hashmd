import { BytemdPlugin } from 'bytemd';
import { Editor } from 'codemirror';

export default function imageHandler(
  fileHandler: (file: File) => Promise<string>
): BytemdPlugin {
  return {
    editorEffect(cm) {
      const handlePaste = async (_: Editor, e: ClipboardEvent) => {
        if (!e.clipboardData) return;
        const { items } = e.clipboardData;
        for (let i = 0; i < items.length; i++) {
          // console.log(items[i]);
          if (!items[i].type.startsWith('image/')) continue;

          e.preventDefault();
          const file = items[i].getAsFile();
          if (!file) continue;

          const url = await fileHandler(file);
          const text = cm.getSelection();
          cm.replaceSelection(`![${text}](${url})`);
          cm.focus();
          return;
        }
      };

      const handleDrop = async (_: Editor, e: DragEvent) => {
        if (!e.dataTransfer) return;
        const { items } = e.dataTransfer;
        for (let i = 0; i < items.length; i++) {
          // console.log(items[i]);
          if (!items[i].type.startsWith('image/')) continue;

          e.preventDefault();
          const file = items[i].getAsFile();
          if (!file) continue;

          const url = await fileHandler(file);
          const text = cm.getSelection();
          cm.replaceSelection(`![${text}](${url})`);
          cm.focus();
          return;
        }
      };

      cm.on('paste', handlePaste);
      cm.on('drop', handleDrop);

      return () => {
        cm.off('paste', handlePaste);
        cm.off('drop', handleDrop);
      };
    },
  };
}
