import { EditorConfiguration } from 'codemirror';

export interface EditorProps {
  source: string;
  codemirrorConfig?: EditorConfiguration;
}

export declare class Editor {
  constructor(options: { target: HTMLElement; props: EditorProps });
}

export interface ViewerProps {
  source: string;
}

export declare class Viewer {
  constructor(options: { target: HTMLElement; props: ViewerProps });
}
