import type { BytemdToolbarItem } from './types';
import * as iconpark from '@icon-park/svg';

export const builtinMap: Record<string, BytemdToolbarItem> = {
  h1: {
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
  h2: {
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
  h3: {
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
  bold: {
    tooltip: 'bold',
    icon: iconpark.TextBold({}).replace('<svg', `<svg style="width:14px"`), // TODO:
    onClick({ editor }) {
      handleText(editor, '**', '**');
    },
  },
  italic: {
    tooltip: 'italic',
    icon: iconpark.TextItalic({}),
    onClick({ editor }) {
      handleText(editor, '_', '_');
    },
  },
  quote: {
    tooltip: 'blockquote',
    icon: iconpark.Quote({}),
    onClick({ editor }) {
      handlePrepend(editor, (lines) => lines.map((line) => `> ${line}`));
    },
  },
  link: {
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
  code: {
    tooltip: 'code',
    icon: iconpark.Code({}),
    onClick({ editor }) {
      handleText(editor, '`', '`');
    },
  },
  codeBlock: {
    tooltip: 'code block',
    icon: iconpark.CodeBrackets({}),
    onClick({ editor }) {
      handlePrepend(editor, (lines) => ['```', ...lines, '```']);
    },
  },
  ol: {
    tooltip: 'ordered list',
    icon: iconpark.OrderedList({}),
    onClick({ editor }) {
      handlePrepend(editor, (lines) =>
        lines.map((line, i) => `${i + 1}. ${line}`)
      );
    },
  },
  ul: {
    tooltip: 'unordered list',
    icon: iconpark.ListCheckbox({}),
    onClick({ editor }) {
      handlePrepend(editor, (lines) => lines.map((line) => `- ${line}`));
    },
  },
};

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
