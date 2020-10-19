import type { BytemdPlugin } from 'bytemd';
import { Pic } from '@icon-park/svg';

export interface ImportImageOptions {
  /**
   * Upload the file and return a URL
   */
  upload(files: File[]): Promise<string[]>;
  /**
   * Test if this file should be handled
   */
  test?(file: File): boolean;
}

export default function importImage({
  upload,
  test = (file: File) => file.type.startsWith('image/'),
}: ImportImageOptions): BytemdPlugin {
  const handleFiles = async (files: File[], editor: CodeMirror.Editor) => {
    const urls = await upload(files);
    const text = urls.map((url) => `![](${url})`).join('\n\n');
    editor.replaceRange(text, editor.getCursor());
    editor.focus();
  };

  return {
    toolbar: {
      image: {
        tooltip: 'image',
        icon: Pic({}),
        onClick({ editor }) {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = 'image/*';
          input.addEventListener('input', (e) => {
            if (input.files?.length) {
              handleFiles(Array.from(input.files), editor);
            }
          });
          input.click();
        },
      },
    },
    editorEffect({ editor }) {
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
          await handleFiles(files, editor);
        }
      };

      editor.on('paste', handler);
      editor.on('drop', handler);

      return () => {
        editor.off('paste', handler);
        editor.off('drop', handler);
      };
    },
  };
}
