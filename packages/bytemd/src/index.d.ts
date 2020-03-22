import { SvelteComponent } from 'svelte';
import { HastNode } from '../helpers';

export interface Plugin {
  /**
   * Transformers for unified to be applied
   */
  transformer?: any; // TODO:
  /**
   * Specify how to render this node
   */
  render(
    node: HastNode,
  ):
    | {
        component: typeof SvelteComponent;
        props?: Record<string, unknown>;
      }
    | undefined;
}

// TODO: https://github.com/sveltejs/svelte/pull/4577
declare class SvelteComponentDev<P> {
  constructor(options: { target: Element; props?: P });
}

export interface EditorProps {
  value: string;
  containerStyle: string;
  fileHandler: (file: File) => Promise<string>;
  plugins?: Plugin[];
}

export interface ViewerProps {
  value: string;
  plugins?: Plugin[];
}

export declare const Editor: SvelteComponentDev<EditorProps>;
export declare const Viewer: SvelteComponentDev<ViewerProps>;
