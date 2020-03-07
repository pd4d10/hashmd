import { EditorConfiguration } from 'codemirror';
import { Node } from 'unist';

export interface Plugin {
  transformNode(node: Node): Node;
  shouldTransformElement(node: Node): boolean;
  transFormElement(node: Node): any;
}

export interface EditorProps {
  source: string;
  codemirrorConfig?: EditorConfiguration;
  plugins?: Plugin[];
}

export declare class Editor {
  constructor(options: { target: HTMLElement; props: EditorProps });
}

export interface ViewerProps {
  source: string;
  plugins?: Plugin[];
}

export declare class Viewer {
  constructor(options: { target: HTMLElement; props: ViewerProps });
}
