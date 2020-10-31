import type { BytemdToolbarItem, EditorProps } from './types';
import { icons } from './icons';

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

const builtinMap: Record<string, BytemdToolbarItem> = {
  h1: {
    tooltip: 'H1',
    icon: icons.h1,
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
    icon: icons.h2,
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
    icon: icons.h3,
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
    icon: icons.bold,
    onClick({ editor }) {
      handleText(editor, '**', '**');
    },
  },
  italic: {
    tooltip: 'italic',
    icon: icons.italic,
    onClick({ editor }) {
      handleText(editor, '_', '_');
    },
  },
  quote: {
    tooltip: 'blockquote',
    icon: icons.quote,
    onClick({ editor }) {
      handlePrepend(editor, (lines) => lines.map((line) => `> ${line}`));
    },
  },
  link: {
    tooltip: 'link',
    icon: icons.link,
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
    icon: icons.code,
    onClick({ editor }) {
      handleText(editor, '`', '`');
    },
  },
  codeBlock: {
    tooltip: 'code block',
    icon: icons.codeBlock,
    onClick({ editor }) {
      handlePrepend(editor, (lines) => ['```', ...lines, '```']);
    },
  },
  ol: {
    tooltip: 'ordered list',
    icon: icons.ol,
    onClick({ editor }) {
      handlePrepend(editor, (lines) =>
        lines.map((line, i) => `${i + 1}. ${line}`)
      );
    },
  },
  ul: {
    tooltip: 'unordered list',
    icon: icons.ul,
    onClick({ editor }) {
      handlePrepend(editor, (lines) => lines.map((line) => `- ${line}`));
    },
  },
};

// TODO:
export function getItemMap(plugins: EditorProps['plugins']) {
  const map = { ...builtinMap };
  plugins?.forEach((p) => {
    Object.assign(map, p.toolbar);
  });
  return map;
}
