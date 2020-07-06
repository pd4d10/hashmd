import debounce from 'lodash.debounce';

export async function initEditor(
  textarea: HTMLTextAreaElement,
  editorConfig: any,
  value: string,
  viewer: HTMLElement,
  dispatch: any,
  debounceMs: number
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
  cm.on(
    'change',
    debounce((doc, change) => {
      if (change.origin !== 'setValue') {
        dispatch('change', { value: cm.getValue() });
      }
    }, debounceMs)
  );
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
