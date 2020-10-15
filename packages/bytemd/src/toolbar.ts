import type { BytemdToolbarItem, EditorProps } from './types';
import * as iconpark from '@icon-park/svg';

const leftItems: BytemdToolbarItem[] = [
  {
    tooltip: 'H1',
    icon: iconpark.H1({}),
    onClick({ editor }) {
      const { line } = editor.getCursor();
      const content = editor.getLine(line);
      // @ts-ignore
      editor.replaceRange(`# ${content}`, { line, ch: 0 }, { line });
      editor.focus();
    },
  },
  {
    tooltip: 'H2',
    icon: iconpark.H2({}),
    onClick({ editor }) {
      const { line } = editor.getCursor();
      const content = editor.getLine(line);
      // @ts-ignore
      editor.replaceRange(`## ${content}`, { line, ch: 0 }, { line });
      editor.focus();
    },
  },
  {
    tooltip: 'H3',
    icon: iconpark.H3({}),
    onClick({ editor }) {
      const { line } = editor.getCursor();
      const content = editor.getLine(line);
      // @ts-ignore
      editor.replaceRange(`### ${content}`, { line, ch: 0 }, { line });
      editor.focus();
    },
  },
  {
    tooltip: 'bold',
    icon: iconpark.TextBold({}).replace('<svg', `<svg style="width:14px"`), // TODO:
    onClick({ editor }) {
      handleText(editor, '**', '**');
    },
  },
  {
    tooltip: 'italic',
    icon: iconpark.TextItalic({}),
    onClick({ editor }) {
      handleText(editor, '_', '_');
    },
  },
  {
    tooltip: 'blockquote',
    icon: iconpark.Quote({}),
    onClick({ editor }) {
      handlePrepend(editor, (lines) => lines.map((line) => `> ${line}`));
    },
  },
  {
    tooltip: 'link',
    icon: iconpark.LinkOne({}),
    onClick({ editor }) {
      if (editor.somethingSelected()) {
        const text = editor.getSelection();
        editor.replaceSelection(`[${text}](url)`);
        const { line, ch } = editor.getCursor();
        editor.setSelection({ line, ch: ch - 4 }, { line, ch: ch - 1 });
      } else {
        editor.replaceRange('[](url)', editor.getCursor());
        const { line, ch } = editor.getCursor();
        editor.setCursor({ line, ch: ch - 6 });
      }
      editor.focus();
    },
  },
  {
    tooltip: 'code',
    icon: iconpark.Code({}),
    onClick({ editor }) {
      handleText(editor, '`', '`');
    },
  },
  {
    tooltip: 'code block',
    icon: iconpark.CodeBrackets({}),
    onClick({ editor }) {
      handlePrepend(editor, (lines) => ['```', ...lines, '```']);
    },
  },
  {
    tooltip: 'ordered list',
    icon: iconpark.OrderedList({}),
    onClick({ editor }) {
      handlePrepend(editor, (lines) =>
        lines.map((line, i) => `${i + 1}. ${line}`)
      );
    },
  },
  {
    tooltip: 'unordered list',
    icon: iconpark.ListCheckbox({}),
    onClick({ editor }) {
      handlePrepend(editor, (lines) => lines.map((line) => `- ${line}`));
    },
  },
];

const rightItems: BytemdToolbarItem[] = [
  {
    tooltip: 'About ByteMD',
    icon: iconpark.Info({}),
    onClick() {
      window.open('https://github.com/bytedance/bytemd');
    },
  },
];

export function getItems(plugins: EditorProps['plugins']) {
  let left = [...leftItems];
  let right = [...rightItems];
  plugins?.forEach((p) => {
    if (p.toolbar?.left) left = p.toolbar.left(left);
    if (p.toolbar?.right) right = p.toolbar.right(right);
  });
  return { left, right };
}

function handleText(editor: CodeMirror.Editor, before: string, after: string) {
  if (editor.somethingSelected()) {
    editor.replaceSelection(before + editor.getSelection() + after);
  } else {
    const { anchor, head } = editor.findWordAt(editor.getCursor());
    const word = editor.getRange(anchor, head);
    editor.replaceRange(before + word + after, anchor, head);
  }
  editor.focus();
}

function handlePrepend(
  editor: CodeMirror.Editor,
  replace: (lines: string[]) => string[]
) {
  const [selection] = editor.listSelections();
  const fromLine = selection.from().line;
  const toLine = selection.to().line;
  const lines = editor
    // @ts-ignore
    .getRange({ line: fromLine, ch: 0 }, { line: toLine })
    .split('\n');
  editor.replaceRange(
    replace(lines).join('\n'),
    { line: fromLine, ch: 0 },
    // @ts-ignore
    { line: toLine }
  );

  editor.focus();
}
