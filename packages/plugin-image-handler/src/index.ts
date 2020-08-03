import { BytemdPlugin } from 'bytemd';
import { Editor } from 'codemirror';

const imageIcon =
  '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-.25V2.75A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z"/></svg>';

export interface ImageHandlerOptions {
  /**
   * Upload the file and return a URL
   */
  upload(file: File): Promise<string>;
  /**
   * Test if this file should be handled
   */
  test?(file: File): boolean;
}

export default function imageHandler({
  upload,
  test = (file: File) => file.type.startsWith('image/'),
}: ImageHandlerOptions): BytemdPlugin {
  const handleFiles = async (files: File[], cm: Editor) => {
    const urls = await Promise.all(files.map((f) => upload(f)));
    const text = urls.map((url) => `![](${url})`).join('\n\n');
    cm.replaceRange(text, cm.getCursor());
    cm.focus();
  };

  return {
    toolbar: {
      left(items) {
        return [
          ...items,
          {
            tooltip: 'image',
            iconHtml: imageIcon,
            onClick(cm) {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = 'image/*';
              input.addEventListener('input', (e) => {
                if (input.files && input.files.length) {
                  handleFiles(Array.from(input.files), cm);
                }
              });
              input.click();
            },
          },
        ];
      },
    },
    editorEffect(cm) {
      const getFilesFromDt = (items: DataTransferItem[]) => {
        return items
          .map((item) => item.getAsFile())
          .filter((f): f is File => f != null && test(f));
      };

      const handlePaste = async (_: Editor, e: ClipboardEvent) => {
        const files = getFilesFromDt(Array.from(e.clipboardData?.items ?? []));
        if (files.length) {
          e.preventDefault();
          await handleFiles(files, cm);
        }
      };

      const handleDrop = async (_: Editor, e: DragEvent) => {
        const files = getFilesFromDt(Array.from(e.dataTransfer?.items ?? []));
        if (files.length) {
          e.preventDefault();
          await handleFiles(files, cm);
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
