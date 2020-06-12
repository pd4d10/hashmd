import Editor from './editor.svelte';
import Viewer from './viewer.svelte';
import { createCodeBlockPlugin, getCodeBlockMeta, HastNode } from './helpers';
import * as cm from 'codemirror';
import * as unified from 'unified';

export { Editor, Viewer, createCodeBlockPlugin, getCodeBlockMeta, HastNode };

type Transformer = (x: unified.Processor) => unified.Processor;

export interface BytemdPlugin {
  remarkTransformer?: Transformer;
  rehypeTransformer?: Transformer;
  markdownSanitizeSchema?: any;
  onMount?(el: HTMLElement): void;
}

export interface EditorProps {
  value: string;
  mode?: 'split' | 'tab';
  containerStyle?: string;
  fileHandler?: (file: File) => Promise<string>;
  plugins?: BytemdPlugin[];
  editorConfig?: Omit<cm.EditorConfiguration, 'value'>;
  /**
   * Components which should be added to toolbar
   */
  toolbarItems?: {
    tooltip?: string;
    bodyHtml: string;
  }[];
}

export interface ViewerProps {
  value: string;
  plugins?: BytemdPlugin[];
}
