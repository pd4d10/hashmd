import { SvelteComponent } from 'svelte';
import { HastNode } from '../helpers';
import * as cm from 'codemirror';

type Props = Record<string, unknown>;

export interface Plugin<P extends Props = Props> {
  /**
   * Transformers for unified to be applied
   */
  transformer?: any; // TODO:
  /**
   * Specify how to render this node
   *
   * If `undefined` returned then go to the next plugin
   */
  render?(
    node: HastNode,
  ): { component: typeof SvelteComponent; props?: P } | undefined;
  /**
   * Components which should be added to toolbar
   */
  toolbarItems?: {
    component: typeof SvelteComponent;
    onClick(cm: cm.Editor): void;
  }[];
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
