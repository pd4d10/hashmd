import { BytemdPlugin } from 'bytemd';

export default function imageUpload(
  fileHandler: (file: File) => Promise<string>
): BytemdPlugin {
  return {
    editorEffect(cm) {
      cm.on('paste', async (_, e) => {
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
      });
      cm.on('drop', async (_, e) => {
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
      });
    },
  };
}
