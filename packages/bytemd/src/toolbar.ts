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

export function handleBlockquote(cm: Editor) {
  if (cm.somethingSelected()) {
    const [selection] = cm.listSelections();
    for (let i = selection.anchor.line; i <= selection.head.line; i++) {
      // @ts-ignore
      cm.replaceRange('> ' + cm.getLine(i), { line: i, ch: 0 }, { line: i });
    }
  } else {
    const { line } = cm.getCursor();
    const content = cm.getLine(line);
    if (content.startsWith('> ')) {
      // @ts-ignore
      cm.replaceRange(content.slice(2), { line, ch: 0 }, { line });
    } else {
      // @ts-ignore
      cm.replaceRange('> ' + content, { line, ch: 0 }, { line });
    }
  }
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

export function handleOl(cm: Editor) {
  if (cm.somethingSelected()) {
    const [selection] = cm.listSelections();
    for (let i = selection.anchor.line; i <= selection.head.line; i++) {
      cm.replaceRange(
        `${i - selection.anchor.line + 1}. ${cm.getLine(i)}`,
        { line: i, ch: 0 },
        // @ts-ignore
        { line: i }
      );
    }
  } else {
    cm.replaceRange('\n\n1. \n\n', cm.getCursor());
  }
  cm.focus();
}

export function handleUl(cm: Editor) {
  if (cm.somethingSelected()) {
    const [selection] = cm.listSelections();
    for (let i = selection.anchor.line; i <= selection.head.line; i++) {
      // @ts-ignore
      cm.replaceRange(`- ${cm.getLine(i)}`, { line: i, ch: 0 }, { line: i });
    }
  } else {
    cm.replaceRange('\n\n- \n\n', cm.getCursor());
  }
  cm.focus();
}

export function handleTask(cm: Editor) {
  if (cm.somethingSelected()) {
    const [selection] = cm.listSelections();
    for (let i = selection.anchor.line; i <= selection.head.line; i++) {
      cm.replaceRange(
        `- [ ] ${cm.getLine(i)}`,
        { line: i, ch: 0 },
        // @ts-ignore
        { line: i }
      );
    }
  } else {
    cm.replaceRange('\n\n- [ ] \n\n', cm.getCursor());
  }
  cm.focus();
}
