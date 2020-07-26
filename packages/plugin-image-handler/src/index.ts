import { BytemdPlugin } from 'bytemd';
import { Editor } from 'codemirror';

const imageIcon =
  '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-.25V2.75A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z"/></svg>';

export interface ImageHandlerOptions {
  toUrl(file: File): Promise<string>;
}

export default function imageHandler({
  toUrl,
}: ImageHandlerOptions): BytemdPlugin {
  const handleImage = async (file: File, cm: Editor) => {
    const url = await toUrl(file);
    const text = cm.getSelection();
    cm.replaceSelection(`![${text}](${url})`);
    cm.focus();
  };

  const test = (file: File) => {
    return file.type.startsWith('image/');
  };

  return {
    toolbar(left) {
      left.push({
        tooltip: 'image',
        iconHtml: imageIcon,
        onClick(cm) {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.addEventListener('input', (e) => {
            if (!input.files) return;
            for (let i = 0; i < input.files.length; i++) {
              handleImage(input.files[i], cm);
            }
          });
          input.click();
        },
      });
    },
    editorEffect(cm) {
      const handlePaste = async (_: Editor, e: ClipboardEvent) => {
        if (!e.clipboardData) return;
        let files: File[] = [];
        for (let item of e.clipboardData.items) {
          const f = item.getAsFile();
          if (f && test(f)) files.push(f);
        }

        for (let file of files) {
          e.preventDefault();
          await handleImage(file, cm);
        }
      };

      const handleDrop = async (_: Editor, e: DragEvent) => {
        if (!e.dataTransfer) return;
        let files: File[] = [];
        for (let item of e.dataTransfer.items) {
          const f = item.getAsFile();
          if (f && test(f)) files.push(f);
        }

        for (let file of files) {
          e.preventDefault();
          await handleImage(file, cm);
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
