import { BytemdToolbarItem, BytemdPlugin } from '.';
import { iconMap } from './icons';

const leftItems: BytemdToolbarItem[] = [
  {
    tooltip: 'heading',
    iconHtml: iconMap.heading,
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
    iconHtml: iconMap.bold,
    onClick(cm) {
      handleText(cm, '**', '**');
    },
  },
  {
    tooltip: 'italic',
    iconHtml: iconMap.italic,
    onClick(cm) {
      handleText(cm, '_', '_');
    },
  },
  {
    tooltip: 'blockquote',
    iconHtml: iconMap.quote,
    onClick(cm) {
      handlePrepend(cm, (lines) => lines.map((line) => `> ${line}`));
    },
  },
  {
    tooltip: 'link',
    iconHtml: iconMap.link,
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
    iconHtml: iconMap.code,
    onClick(cm) {
      handleText(cm, '`', '`');
    },
  },
  {
    tooltip: 'code block',
    iconHtml: iconMap.codeBlock,
    onClick(cm) {
      handlePrepend(cm, (lines) => ['```', ...lines, '```']);
    },
  },
  {
    tooltip: 'table',
    iconHtml: iconMap.table,
    onClick(cm) {
      const pos = cm.getCursor();
      cm.replaceRange(
        `
|  |  |
| --- | --- |
|  |  |
    `,
        pos
      );
      cm.setCursor({ line: pos.line + 1, ch: 2 });
      cm.focus();
    },
  },
  {
    tooltip: 'ordered list',
    iconHtml: iconMap.ol,
    onClick(cm) {
      handlePrepend(cm, (lines) => lines.map((line, i) => `${i + 1}. ${line}`));
    },
  },
  {
    tooltip: 'unordered list',
    iconHtml: iconMap.ul,
    onClick(cm) {
      handlePrepend(cm, (lines) => lines.map((line) => `- ${line}`));
    },
  },
  {
    tooltip: 'task list',
    iconHtml: iconMap.tasklist,
    onClick(cm) {
      handlePrepend(cm, (lines) => lines.map((line) => `- [ ] ${line}`));
    },
  },
];

const rightItems: BytemdToolbarItem[] = [
  {
    tooltip: 'About ByteMD',
    iconHtml: iconMap.info,
    onClick() {
      window.open('https://github.com/bytedance/bytemd');
    },
  },
];

export function getItems(plugins: BytemdPlugin[]) {
  let left = [...leftItems];
  let right = [...rightItems];
  plugins.forEach((p) => {
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
