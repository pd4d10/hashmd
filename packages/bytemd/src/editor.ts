export async function initEditor(
  textarea: HTMLTextAreaElement,
  editorConfig: any,
  value: string,
  viewer: HTMLElement,
  dispatch: any
) {
  const codemirror = await import('codemirror');
  // @ts-ignore
  await import('codemirror/mode/markdown/markdown.js');
  const cm = codemirror.fromTextArea(textarea, {
    mode: 'markdown',
    lineWrapping: true,
    ...editorConfig,
  });
  cm.setValue(value);
  cm.on('change', (doc, change) => {
    if (change.origin !== 'setValue') {
      dispatch('change', { value: cm.getValue() });
    }
  });
  cm.on('scroll', (cm) => {
    requestAnimationFrame(() => {
      const editorInfo = cm.getScrollInfo();
      const ratio =
        editorInfo.top / (editorInfo.height - editorInfo.clientHeight);
      viewer.scrollTo(0, ratio * (viewer.scrollHeight - viewer.clientHeight));
    });
  });
  return cm;
}
