import { EditorConfiguration } from 'codemirror';
import { Node } from 'unist';
import { SvelteComponent } from 'svelte';

export interface Plugin {
  shouldTransformElement?(node: Node): boolean;
  shouldTransformHtmlElement?(node: Node): boolean;
  component: typeof SvelteComponent;
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
