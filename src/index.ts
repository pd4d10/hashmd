import marked from 'marked';
import { getActualDom } from 'utils';

export interface EditorOptions {
  el: string | HTMLElement;
}

export class Editor {
  constructor(options: EditorOptions) {
    const $dom = getActualDom(options.el);
    const $eel = document.createElement('textarea');
    const $vel = document.createElement('div');
    $dom.appendChild($eel);
    $dom.appendChild($vel);

    $eel.addEventListener('keyup', () => {
      new Viewer({ el: $vel, input: $eel.value });
    });
  }
}

export interface ViewerOptions {
  el: string | HTMLElement;
  input: string;
}

export class Viewer {
  constructor(options: ViewerOptions) {
    const $dom = getActualDom(options.el);
    $dom.innerHTML = marked(options.input);
  }
}
