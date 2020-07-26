import { Editor } from 'codemirror';
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
      handlePrepend(
        cm,
        () => '> ',
        (line) => line.startsWith('>')
      );
    },
  },
  {
    tooltip: 'link',
    iconHtml: iconMap.link,
    onClick(cm) {
      if (cm.somethingSelected()) {
        const text = cm.getSelection();
        cm.replaceSelection(`[${text}]()`);
      } else {
        const pos = cm.getCursor();
        cm.replaceRange('[]()', pos);
      }
      cm.focus();
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
      handlePrepend(
        cm,
        (i) => i + 1 + '. ',
        (line) => /^\d+\./.test(line)
      );
    },
  },
  {
    tooltip: 'unordered list',
    iconHtml: iconMap.ol,
    onClick(cm) {
      handlePrepend(
        cm,
        () => '- ',
        (line) => /^[-*]/.test(line)
      );
    },
  },
  {
    tooltip: 'task list',
    iconHtml: iconMap.tasklist,
    onClick(cm) {
      handlePrepend(
        cm,
        () => '- [ ] ',
        (line) => /^[-*] \[ \]/.test(line)
      );
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
  const left = [...leftItems];
  const right = [...rightItems];
  plugins.forEach((p) => {
    p.toolbar?.(left, right);
  });
  return { left, right };
}

function handleText(cm: Editor, before: string, after: string) {
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
  cm: Editor,
  prefixGen: (index: number) => string,
  test: (line: string) => boolean
) {
  const [selection] = cm.listSelections();
  const lines = cm
    .getRange(
      { line: selection.anchor.line, ch: 0 },
      // @ts-ignore
      { line: selection.head.line }
    )
    .split('\n');
  if (lines.every(test)) {
    // TODO:
  }
  cm.replaceRange(
    lines.map((line, i) => prefixGen(i) + line).join('\n'),
    { line: selection.anchor.line, ch: 0 },
    // @ts-ignore
    { line: selection.head.line }
  );

  cm.focus();
}
