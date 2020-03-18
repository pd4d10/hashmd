import { Editor } from 'codemirror';
import { EditorProps } from '.';

export function handleDec(cm: Editor, decorator: string) {
  if (cm.somethingSelected()) {
    cm.replaceSelection(decorator + cm.getSelection() + decorator);
  } else {
    const { anchor, head } = cm.findWordAt(cm.getCursor());
    const word = cm.getRange(anchor, head);
    cm.replaceRange(decorator + word + decorator, anchor, head);
  }
  cm.focus();
}

export function handleBlockquote(cm: Editor) {
  if (cm.somethingSelected()) {
    const [selection] = cm.listSelections();
    for (let i = selection.anchor.line; i <= selection.head.line; i++) {
      cm.replaceRange('> ' + cm.getLine(i), { line: i, ch: 0 }, { line: i });
    }
  } else {
    const { line } = cm.getCursor();
    const content = cm.getLine(line);
    if (content.startsWith('> ')) {
      cm.replaceRange(content.slice(2), { line, ch: 0 }, { line });
    } else {
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

export const dataUrlFileHandler: EditorProps['fileHandler'] = async file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', e => {
      resolve(e.target!.result as string);
    });
    reader.addEventListener('error', e => {
      reject(new Error('readAsDataURL error'));
    });
    reader.readAsDataURL(file);
  });
};

export async function handleImage(
  cm: Editor,
  e: InputEvent,
  fileHandler: EditorProps['fileHandler']
) {
  const $ = e.target as HTMLInputElement;
  if (!$.files) return;
  const file = $.files[0];
  const url = await fileHandler(file);
  const text = cm.getSelection();
  cm.replaceSelection(`![${text}](${url})`);
  cm.focus();
}
