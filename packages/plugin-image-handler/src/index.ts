import { BytemdPlugin } from 'bytemd';
import { Pic } from '@icon-park/svg';

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
  const handleFiles = async (files: File[], cm: CodeMirror.Editor) => {
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
            iconHtml: Pic({}),
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
      const handler = async (
        _: CodeMirror.Editor,
        e: ClipboardEvent | DragEvent
      ) => {
        const itemList =
          e instanceof ClipboardEvent
            ? e.clipboardData?.items
            : e.dataTransfer?.items;

        const files = Array.from(itemList ?? [])
          .map((item) => item.getAsFile())
          .filter((f): f is File => f != null && test(f));
        if (files.length) {
          e.preventDefault();
          await handleFiles(files, cm);
        }
      };

      cm.on('paste', handler);
      cm.on('drop', handler);

      return () => {
        cm.off('paste', handler);
        cm.off('drop', handler);
      };
    },
  };
}
