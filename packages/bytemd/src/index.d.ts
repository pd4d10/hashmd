import { Node } from 'unist';
import { SvelteComponent } from 'svelte';

export interface Plugin {
  /**
   * Transformers for unified to be applied
   */
  transformer?: any; // TODO:
  /**
   * Test if this node should be rendered
   */
  test(node: Node): boolean;
  /**
   * The component to render this node
   */
  component: typeof SvelteComponent;
  /**
   * The extra props passed to component
   */
  props?: Record<string, unknown>;
}

// TODO: https://github.com/sveltejs/svelte/pull/4577
declare class SvelteComponentDev<P> {
  constructor(options: { target: Element; props?: P });
}

export interface EditorProps {
  value: string;
  onChange(value: string): void;
  fileHandler: (file: File) => Promise<string>;
  plugins?: Plugin[];
}

export interface ViewerProps {
  value: string;
  plugins?: Plugin[];
}

export declare const Editor: SvelteComponentDev<EditorProps>;
export declare const Viewer: SvelteComponentDev<ViewerProps>;
