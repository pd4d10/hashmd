import { BytemdPlugin, EditorContext } from 'bytemd';
import { icons } from './icons';

export interface ImportImageOptions {
  /**
   * Upload the file and return a URL
   */
  upload(files: File[]): Promise<string[]>;
}

export default function importImage({
  upload,
}: ImportImageOptions): BytemdPlugin {
  const handleFiles = async (files: File[], utils: EditorContext['utils']) => {
    const urls = await upload(files);
    utils.appendBlock(urls.map((url) => `![](${url})`).join('\n\n'));
  };

  return {
    toolbar: {
      image: {
        tooltip: 'Image',
        icon: icons.image,
        onClick({ utils }) {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = 'image/*';
          input.addEventListener('input', (e) => {
            const files = Array.from(input.files ?? []).filter(
              // input accept would not work if 'all files' is selected
              (item) => item.type.startsWith('image/')
            );

            if (files?.length) {
              handleFiles(files, utils);
            }
          });
          input.click();
        },
      },
    },
    editorEffect({ editor, utils }) {
      const handler = async (
        _: CodeMirror.Editor,
        e: ClipboardEvent | DragEvent
      ) => {
        const itemList =
          e instanceof ClipboardEvent
            ? e.clipboardData?.items
            : e.dataTransfer?.items;

        const files = Array.from(itemList ?? [])
          .map((item) => {
            if (item.type.startsWith('image/')) {
              return item.getAsFile();
            }
          })
          .filter((f): f is File => f != null);

        if (files.length) {
          e.preventDefault();
          await handleFiles(files, utils);
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
