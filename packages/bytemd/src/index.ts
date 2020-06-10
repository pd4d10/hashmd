import Editor from './editor.svelte';
import Viewer from './viewer.svelte';
import { createCodeBlockPlugin, getCodeBlockMeta, HastNode } from './helpers';
import * as cm from 'codemirror';
import * as unified from 'unified';

export { Editor, Viewer, createCodeBlockPlugin, getCodeBlockMeta, HastNode };

export type UnifiedTransformer = (x: unified.Processor) => unified.Processor;

export interface EditorProps {
  value: string;
  remarkTransformer?: UnifiedTransformer;
  rehypeTransformer?: UnifiedTransformer;
  mode?: 'split' | 'tab';
  containerStyle?: string;
  fileHandler?: (file: File) => Promise<string>;
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
  remarkTransformer?: UnifiedTransformer;
  rehypeTransformer?: UnifiedTransformer;
}
