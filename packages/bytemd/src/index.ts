// @ts-ignore
import Editor from './editor.svelte';
// @ts-ignore
import Viewer from './viewer.svelte';
import codemirror from 'codemirror';
import * as unified from 'unified';
import { RemarkParseOptions } from 'remark-parse';

import 'codemirror/lib/codemirror.css';
import 'tippy.js/dist/tippy.css';
import './index.css';

export { Editor, Viewer };
export { processMarkdown } from './utils';

type UnifiedProcessor = (x: unified.Processor) => unified.Processor;

export interface BytemdPlugin {
  remark?: UnifiedProcessor;
  rehype?: UnifiedProcessor;
  sanitizeSchema?: any;
  editorEffect?(cm: codemirror.Editor): void | (() => void);
  viewerEffect?(el: HTMLElement): void | (() => void);
}

export interface EditorProps extends ViewerProps {
  mode?: 'split' | 'tab';
  editorConfig?: Omit<codemirror.EditorConfiguration, 'value'>;
  /**
   * Components which should be added to toolbar
   */
  toolbarItems?: {
    tooltip?: string;
    bodyHtml: string;
  }[];
  previewDebounce?: number;
}

export interface ViewerProps {
  value: string;
  markdownOptions?: Partial<RemarkParseOptions>;
  plugins?: BytemdPlugin[];
}
