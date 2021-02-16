import type { Processor } from 'unified';
import type { Schema } from 'hast-util-sanitize';
import type { VFile } from 'vfile';
import type { Editor, EditorConfiguration } from 'codemirror';
import type { EditorUtils } from './editor';
import type { BytemdLocale } from './locales/en-US';
import type { createPopper } from '@popperjs/core';

export interface BytemdEditorContext extends EditorUtils {
  /**
   * CodeMirror editor instance
   */
  editor: Editor;
  /**
   * The root element
   */
  root: HTMLElement;
  /**
   * Show a dropdown menu to select items
   */
  showDropdown(payload: {
    popperOptions?: Parameters<typeof createPopper>[2];
    items: {
      text: string;
      onClick?(): void;
      onMouseEnter?(): void;
      onMouseLeave?(): void;
    }[];
  }): void;
}

export interface BytemdViewerContext {
  /**
   * The root element of the viewer
   */
  markdownBody: HTMLElement;
  /**
   * Virtual file format used in [unified](https://unifiedjs.com/)
   *
   * Get the HTML output by calling `vfile.toString()`
   */
  file: VFile;
}

export interface BytemdAction {
  /**
   * Action icon (16x16), could be <img> or inline svg
   */
  icon: string;
  /**
   * Action title
   */
  title: string;
  /**
   * Action handler, used for toolbar icon click and shortcut trigger
   */
  handler?: (context: BytemdEditorContext) => void;
  /**
   * Markdown syntax cheat sheet
   *
   * If specified, this record will be added to the Markdown cheat sheet section
   */
  cheatsheet?: string;
  /**
   * Keyboard shortcut
   *
   * If specified, this record will be added to the Keyboard shortcut section
   *
   * https://codemirror.net/doc/manual.html#keymaps
   */
  shortcut?: string;
}

export interface BytemdPlugin {
  /**
   * Customize Markdown parse by remark plugins:
   *
   * https://github.com/remarkjs/remark/blob/main/doc/plugins.md
   */
  remark?: (p: Processor) => Processor;
  /**
   * Customize HTML parse by rehype plugins:
   *
   * https://github.com/rehypejs/rehype/blob/main/doc/plugins.md
   */
  rehype?: (p: Processor) => Processor;
  /**
   * Register actions in toolbar, cheatsheet and shortcuts
   */
  action?: BytemdAction | BytemdAction[];
  /**
   * Side effect for the editor, triggers when plugin changes
   */
  editorEffect?(context: BytemdEditorContext): void | (() => void);
  /**
   * Side effect for the viewer, triggers when viewer props changes
   */
  viewerEffect?(context: BytemdViewerContext): void | (() => void);
}

export interface EditorProps extends ViewerProps {
  /**
   * Editor display mode
   *
   * - `split`: edit on the left and preview on the right
   * - `tab`: click tabs to switch between edit and preview
   * - `auto`: auto determined by the width of editor container
   *
   * @defaultValue `auto`
   */
  mode?: 'split' | 'tab' | 'auto';
  /**
   * Debounce time (ms) for preview
   *
   * @defaultValue 300
   */
  previewDebounce?: number;
  /**
   * Editor placeholder
   */
  placeholder?: string;
  /**
   * CodeMirror editor config
   *
   * https://codemirror.net/doc/manual.html#config
   */
  editorConfig?: Omit<EditorConfiguration, 'value' | 'placeholder'>;
  /**
   * i18n locale
   *
   * @defaultValue enUS
   */
  locale?: BytemdLocale;
  /**
   * Handle images upload
   */
  uploadImages?: (
    files: File[]
  ) => Promise<
    {
      src: string;
      alt?: string;
      title?: string;
    }[]
  >;
}

export interface ViewerProps {
  /**
   * Markdown text
   */
  value: string;
  /**
   * ByteMD plugin list
   */
  plugins?: BytemdPlugin[];
  /**
   * Sanitize strategy: Defaults to GitHub style sanitation with class names allowed
   *
   * https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/github.json
   *
   * If you want further customization, pass a function to mutate sanitize schema.
   */
  sanitize?: (schema: Schema) => Schema;
}
