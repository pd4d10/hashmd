import { Editor } from 'codemirror';

export function handleText(cm: Editor, before: string, after: string) {
  if (cm.somethingSelected()) {
    cm.replaceSelection(before + cm.getSelection() + after);
  } else {
    const { anchor, head } = cm.findWordAt(cm.getCursor());
    const word = cm.getRange(anchor, head);
    cm.replaceRange(before + word + after, anchor, head);
  }
  cm.focus();
}

export function handleDec(cm: Editor, decorator: string) {
  return handleText(cm, decorator, decorator);
}

export function handleHeading(cm: Editor) {
  const { line } = cm.getCursor();
  const content = cm.getLine(line);
  // @ts-ignore
  cm.replaceRange(`### ${content}`, { line, ch: 0 }, { line });
  cm.focus();
}

export function handleLink(cm: Editor) {
  if (cm.somethingSelected()) {
    const text = cm.getSelection();
    cm.replaceSelection(`[${text}]()`);
  } else {
    const pos = cm.getCursor();
    cm.replaceRange('[]()', pos);
  }
  cm.focus();
}

export function handleTable(cm: Editor) {
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

export function handleBlockquote(cm: Editor) {
  return handlePrepend(
    cm,
    () => '> ',
    (line) => line.startsWith('>')
  );
}

export function handleOl(cm: Editor) {
  return handlePrepend(
    cm,
    (i) => i + 1 + '. ',
    (line) => /^\d+\./.test(line)
  );
}

export function handleUl(cm: Editor) {
  return handlePrepend(
    cm,
    () => '- ',
    (line) => /^[-*]/.test(line)
  );
}

export function handleTask(cm: Editor) {
  return handlePrepend(
    cm,
    () => '- [ ] ',
    (line) => /^[-*] \[ \]/.test(line)
  );
}
