import Editor from './editor.svelte';
import Viewer from './viewer.svelte';
import { EditorConfiguration } from 'codemirror';
import * as unified from 'unified';

export { Editor, Viewer };
export { processMarkdown } from './utils';

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
  editorConfig?: Omit<EditorConfiguration, 'value'>;
  /**
   * Components which should be added to toolbar
   */
  toolbarItems?: {
    tooltip?: string;
    bodyHtml: string;
  }[];
  debounceMs?: number;
}

export interface ViewerProps {
  value: string;
  plugins?: BytemdPlugin[];
}
