import Editor from './editor.svelte';
import Viewer from './viewer.svelte';
import { createCodeBlockPlugin, getCodeBlockMeta, HastNode } from './helpers';
import * as cm from 'codemirror';
import { SvelteComponent } from 'svelte';

export { Editor, Viewer, createCodeBlockPlugin, getCodeBlockMeta, HastNode };

type Props = Record<string, unknown>;

export interface BytemdPlugin<P extends Props = Props> {
  /**
   * Transformers for unified to be applied
   */
  transformer?: any; // TODO:
  /**
   * Specify how to render this node
   *
   * If `undefined` returned then go to the next plugin
   */
  renderNode?(
    node: HastNode
  ): { component: typeof SvelteComponent; props?: P } | undefined;
  /**
   * Components which should be added to toolbar
   */
  toolbarItems?: {
    component: typeof SvelteComponent;
    props?: Props;
    tooltip?: string;
  }[];
}

export interface EditorProps {
  value: string;
  mode?: 'split' | 'tab';
  containerStyle?: string;
  fileHandler?: (file: File) => Promise<string>;
  plugins?: BytemdPlugin[];
  editorConfig?: Omit<cm.EditorConfiguration, 'value'>;
}

export interface ViewerProps {
  value: string;
  plugins?: BytemdPlugin[];
}
