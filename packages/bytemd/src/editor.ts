import type { Editor } from 'codemirror';
import type { BytemdPlugin, BytemdToolbarItem } from './types';
import type { BytemdLocale } from './locales/en-US';
import { icons } from './icons';

export type EditorUtils = ReturnType<typeof createUtils>;

export function createUtils(editor: Editor) {
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

export function getBuiltinItems(
  locale: BytemdLocale,
  plugins: BytemdPlugin[]
): BytemdToolbarItem[] {
  const items: BytemdToolbarItem[] = [
    {
      icon: icons.heading,
      onClick({ utils }) {
        utils.replaceLines((lines) => lines.map((line) => '# ' + line));
      },
      ...locale.heading,
    },
    {
      icon: icons.bold,
      shortcut: getShortcutWithPrefix('B'),
      onClick({ utils }) {
        utils.wrapText('**');
      },
      ...locale.bold,
    },
    {
      icon: icons.italic,
      shortcut: getShortcutWithPrefix('I'),
      onClick({ utils }) {
        utils.wrapText('_');
      },
      ...locale.italic,
    },
    {
      icon: icons.quote,
      onClick({ utils }) {
        utils.replaceLines((lines) => lines.map((line) => '> ' + line));
      },
      ...locale.quote,
    },
    {
      icon: icons.link,
      shortcut: getShortcutWithPrefix('K'),
      onClick({ editor, utils }) {
        if (editor.somethingSelected()) {
          utils.wrapText('[', '](url)');
          const cursor = editor.getCursor();
          editor.setSelection(
            { line: cursor.line, ch: cursor.ch + 2 },
            { line: cursor.line, ch: cursor.ch + 5 }
          );
        } else {
          utils.wrapText('[', '](url)');
        }
      },
      ...locale.link,
    },
    {
      icon: icons.code,
      onClick({ utils }) {
        utils.wrapText('`');
      },
      ...locale.code,
    },
    {
      icon: icons.codeBlock,
      onClick({ editor, utils }) {
        const { startLine } = utils.appendBlock('```js\n```');
        editor.setSelection(
          { line: startLine, ch: 3 },
          { line: startLine, ch: 5 }
        );
      },
      ...locale.pre,
    },
    {
      icon: icons.ul,
      onClick({ utils }) {
        utils.replaceLines((lines) => lines.map((line) => '- ' + line));
      },
      ...locale.ul,
    },
    {
      icon: icons.ol,
      onClick({ utils }) {
        utils.replaceLines((lines) =>
          lines.map((line, i) => `${i + 1}. ${line}`)
        );
      },
      ...locale.ol,
    },
    {
      icon: icons.hr,
      onClick({ utils }) {
        utils.appendBlock('---');
      },
      ...locale.hr,
    },
  ];

  plugins.forEach((p) => {
    if (Array.isArray(p.toolbar)) {
      items.push(...p.toolbar);
    } else if (p.toolbar) {
      items.push(p.toolbar);
    }
  });
  return items;
}
