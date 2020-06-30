import Editor from './editor.svelte';
import Viewer from './viewer.svelte';
import * as codemirror from 'codemirror';
import * as unified from 'unified';
import { RemarkParseOptions } from 'remark-parse';

import 'codemirror/lib/codemirror.css';
import 'tippy.js/dist/tippy.css';
import './index.css';

export { Editor, Viewer };
export { processMarkdown } from './utils';

type Transformer = (x: unified.Processor) => unified.Processor;

export interface BytemdPlugin {
  remarkTransformer?: Transformer;
  rehypeTransformer?: Transformer;
  markdownSanitizeSchema?: any;
  onMount?(el: HTMLElement): void;
}

export interface EditorProps extends ViewerProps {
  mode?: 'split' | 'tab';
  containerStyle?: string;
  fileHandler?: (file: File) => Promise<string>;
  editorConfig?: Omit<codemirror.EditorConfiguration, 'value'>;
  toolbar?: boolean;
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
  markdownOptions?: Partial<RemarkParseOptions>;
  plugins?: BytemdPlugin[];
}
