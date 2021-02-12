import type { Editor } from 'codemirror';
import type { BytemdPlugin, BytemdAction, EditorProps } from './types';
import type { BytemdLocale } from './locales/en-US';
import { icons } from './icons';
import selectFiles from 'select-files';

export type EditorUtils = ReturnType<typeof createEditorUtils>;

export function createEditorUtils(editor: Editor) {
  return {
    /**
     * Wrap text with decorators, for example:
     *
     * `text -> *text*`
     */
    wrapText(before: string, after = before) {
      editor.focus();

      const [selection] = editor.listSelections(); // only handle the first selection
      const from = selection.from(); // use from/to instead of anchor/head for reverse select
      const to = selection.to();

      const text = editor.getRange(from, to) || 'text';
      editor.replaceRange(before + text + after, from, to);

      // select the original text
      const cursor = editor.getCursor();
      editor.setSelection(
        {
          line: cursor.line,
          ch: cursor.ch - after.length - text.length,
        },
        {
          line: cursor.line,
          ch: cursor.ch - after.length,
        }
      );
    },
    /**
     * replace multiple lines
     *
     * `line -> # line`
     */
    replaceLines(replace: (lines: string[]) => string[]) {
      editor.focus();

      const [selection] = editor.listSelections();
      const from = selection.from();
      const to = selection.to();

      const lines = editor
        .getRange(
          { line: from.line, ch: 0 },
          // @ts-ignore
          { line: to.line }
        )
        .split('\n');

      editor.replaceRange(
        replace(lines).join('\n'),
        { line: from.line, ch: 0 },
        // @ts-ignore
        { line: to.line }
      );
    },
    /**
     * Append a block based on the cursor position
     */
    appendBlock(content: string) {
      editor.focus();

      const cursor = editor.getCursor();
      editor.replaceRange(
        '\n' + content,
        // @ts-ignore
        { line: cursor.line }
      );

      return {
        startLine: cursor.line + 1,
      };
    },
  };
}

export function findStartIndex(num: number, nums: number[]) {
  let startIndex = nums.length - 2;
  for (let i = 0; i < nums.length; i++) {
    if (num < nums[i]) {
      startIndex = i - 1;
      break;
    }
  }
  startIndex = Math.max(startIndex, 0); // ensure >= 0
  return startIndex;
}

const getShortcutWithPrefix = (key: string) => {
  if (typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)) {
    return 'Cmd-' + key;
  } else {
    return 'Ctrl-' + key;
  }
};

export function getBuiltinActions(
  locale: BytemdLocale,
  plugins: BytemdPlugin[],
  uploadImages: EditorProps['uploadImages']
): BytemdAction[] {
  const items: BytemdAction[] = [
    {
      ...locale.heading,
      icon: icons.heading,
      handler({ replaceLines }) {
        replaceLines((lines) => lines.map((line) => '# ' + line));
      },
    },
    {
      ...locale.bold,
      icon: icons.bold,
      shortcut: getShortcutWithPrefix('B'),
      handler({ wrapText }) {
        wrapText('**');
      },
    },
    {
      ...locale.italic,
      icon: icons.italic,
      shortcut: getShortcutWithPrefix('I'),
      handler({ wrapText }) {
        wrapText('_');
      },
    },
    {
      ...locale.quote,
      icon: icons.quote,
      handler({ replaceLines }) {
        replaceLines((lines) => lines.map((line) => '> ' + line));
      },
    },
    {
      ...locale.link,
      icon: icons.link,
      shortcut: getShortcutWithPrefix('K'),
      handler({ editor, wrapText }) {
        if (editor.somethingSelected()) {
          wrapText('[', '](url)');
          const cursor = editor.getCursor();
          editor.setSelection(
            { line: cursor.line, ch: cursor.ch + 2 },
            { line: cursor.line, ch: cursor.ch + 5 }
          );
        } else {
          wrapText('[', '](url)');
        }
      },
    },
    {
      ...locale.image,
      icon: icons.image,
      handler: uploadImages
        ? async ({ appendBlock }) => {
            const fileList = await selectFiles({
              accept: 'image/*',
              multiple: true,
            });
            const files = Array.from(fileList ?? []);
            const urls = await uploadImages(files);
            appendBlock(urls.map((url) => `![](${url})`).join('\n\n'));
          }
        : undefined,
    },
    {
      ...locale.code,
      icon: icons.code,
      handler({ wrapText }) {
        wrapText('`');
      },
    },
    {
      ...locale.pre,
      icon: icons.codeBlock,
      handler({ editor, appendBlock }) {
        const { startLine } = appendBlock('```js\n```');
        editor.setSelection(
          { line: startLine, ch: 3 },
          { line: startLine, ch: 5 }
        );
      },
    },
    {
      ...locale.ul,
      icon: icons.ul,
      handler({ replaceLines }) {
        replaceLines((lines) => lines.map((line) => '- ' + line));
      },
    },
    {
      ...locale.ol,
      icon: icons.ol,
      handler({ replaceLines }) {
        replaceLines((lines) => lines.map((line, i) => `${i + 1}. ${line}`));
      },
    },
    {
      ...locale.hr,
      icon: icons.hr,
    },
  ];

  plugins.forEach((p) => {
    if (Array.isArray(p.action)) {
      items.push(...p.action);
    } else if (p.action) {
      items.push(p.action);
    }
  });
  return items;
}
