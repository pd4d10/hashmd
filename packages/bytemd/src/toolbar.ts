import type { BytemdToolbarItem, EditorProps } from './types';
import * as icon from '@icon-park/svg';

const leftItems: BytemdToolbarItem[] = [
  {
    tooltip: 'H1',
    iconHtml: icon.H1({}),
    onClick(cm) {
      const { line } = cm.getCursor();
      const content = cm.getLine(line);
      // @ts-ignore
      cm.replaceRange(`# ${content}`, { line, ch: 0 }, { line });
      cm.focus();
    },
  },
  {
    tooltip: 'H2',
    iconHtml: icon.H2({}),
    onClick(cm) {
      const { line } = cm.getCursor();
      const content = cm.getLine(line);
      // @ts-ignore
      cm.replaceRange(`## ${content}`, { line, ch: 0 }, { line });
      cm.focus();
    },
  },
  {
    tooltip: 'H3',
    iconHtml: icon.H3({}),
    onClick(cm) {
      const { line } = cm.getCursor();
      const content = cm.getLine(line);
      // @ts-ignore
      cm.replaceRange(`### ${content}`, { line, ch: 0 }, { line });
      cm.focus();
    },
  },
  {
    tooltip: 'bold',
    iconHtml: icon.TextBold({}),
    onClick(cm) {
      handleText(cm, '**', '**');
    },
  },
  {
    tooltip: 'italic',
    iconHtml: icon.TextItalic({}),
    onClick(cm) {
      handleText(cm, '_', '_');
    },
  },
  {
    tooltip: 'blockquote',
    iconHtml: icon.Quote({}),
    onClick(cm) {
      handlePrepend(cm, (lines) => lines.map((line) => `> ${line}`));
    },
  },
  {
    tooltip: 'link',
    iconHtml: icon.LinkOne({}),
    onClick(cm) {
      if (cm.somethingSelected()) {
        const text = cm.getSelection();
        cm.replaceSelection(`[${text}](url)`);
        const { line, ch } = cm.getCursor();
        cm.setSelection({ line, ch: ch - 4 }, { line, ch: ch - 1 });
      } else {
        cm.replaceRange('[](url)', cm.getCursor());
        const { line, ch } = cm.getCursor();
        cm.setCursor({ line, ch: ch - 6 });
      }
      cm.focus();
    },
  },
  {
    tooltip: 'code',
    iconHtml: icon.Code({}),
    onClick(cm) {
      handleText(cm, '`', '`');
    },
  },
  {
    tooltip: 'code block',
    iconHtml: icon.CodeBrackets({}),
    onClick(cm) {
      handlePrepend(cm, (lines) => ['```', ...lines, '```']);
    },
  },
  {
    tooltip: 'ordered list',
    iconHtml: icon.OrderedList({}),
    onClick(cm) {
      handlePrepend(cm, (lines) => lines.map((line, i) => `${i + 1}. ${line}`));
    },
  },
  {
    tooltip: 'unordered list',
    iconHtml: icon.ListCheckbox({}),
    onClick(cm) {
      handlePrepend(cm, (lines) => lines.map((line) => `- ${line}`));
    },
  },
];

const rightItems: BytemdToolbarItem[] = [
  {
    tooltip: 'About ByteMD',
    iconHtml: icon.Info({}),
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

function handleText(cm: CodeMirror.Editor, before: string, after: string) {
  if (cm.somethingSelected()) {
    cm.replaceSelection(before + cm.getSelection() + after);
  } else {
    const { anchor, head } = cm.findWordAt(cm.getCursor());
    const word = cm.getRange(anchor, head);
    cm.replaceRange(before + word + after, anchor, head);
  }
  cm.focus();
}

function handlePrepend(
  cm: CodeMirror.Editor,
  replace: (lines: string[]) => string[]
) {
  const [selection] = cm.listSelections();
  const fromLine = selection.from().line;
  const toLine = selection.to().line;
  const lines = cm
    // @ts-ignore
    .getRange({ line: fromLine, ch: 0 }, { line: toLine })
    .split('\n');
  cm.replaceRange(
    replace(lines).join('\n'),
    { line: fromLine, ch: 0 },
    // @ts-ignore
    { line: toLine }
  );

  cm.focus();
}
