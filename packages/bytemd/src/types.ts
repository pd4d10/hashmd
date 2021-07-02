import type { Processor } from 'unified';
import type { Schema } from 'hast-util-sanitize';
import type { VFile } from 'vfile';
import type { Editor, EditorConfiguration } from 'codemirror';
import type CodeMirror from 'codemirror';
import type { EditorUtils } from './editor';
import type en from './locales/en.json';
import type { Image } from 'mdast';
import type { DeepPartial } from 'tsdef';

export type BytemdLocale = typeof en;

export interface BytemdEditorContext extends EditorUtils {
  codemirror: typeof CodeMirror;
  /**
   * CodeMirror editor instance
   */
  editor: Editor;
  /**
   * The root element
   */
  root: HTMLElement;
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

type Listener = (context: BytemdEditorContext) => void;

type BytemdActionHandler =
  | {
      type: 'action';
      click: Listener;
      /**
       * Keyboard shortcut
       *
       * If specified, this shortcut will bind to click listener
       * and will be added to the Keyboard shortcut section
       *
       * https://codemirror.net/doc/manual.html#keymaps
       */
      shortcut?: string;
      /**
       * mouseenter event listener, only takes effect in dropdown items
       */
      mouseenter?: Listener;
      /**
       * mouseleave event listener, only takes effect in dropdown items
       */
      mouseleave?: Listener;
    }
  | {
      type: 'dropdown';
      actions: BytemdAction[];
    };

export interface BytemdAction {
  /**
   * Action title
   */
  title?: string;
  /**
   * Action icon (16x16), usually inline svg
   */
  icon?: string;
  /**
   * Markdown syntax cheatsheet
   *
   * If specified, this record will be added to the Markdown cheatsheet section
   */
  cheatsheet?: string;
  /**
   * Action handler
   */
  handler?: BytemdActionHandler;
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
  actions?: BytemdAction[];
  /**
   * Side effect for the editor, triggers when plugin changes
   */
  editorEffect?(ctx: BytemdEditorContext): void | (() => void);
  /**
   * Side effect for the viewer, triggers when viewer props changes
   */
  viewerEffect?(ctx: BytemdViewerContext): void | (() => void);
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
   * @defaultValue en
   */
  locale?: DeepPartial<BytemdLocale>;
  /**
   * Handle images upload
   */
  uploadImages?: (
    files: File[]
  ) => Promise<Pick<Image, 'url' | 'alt' | 'title'>[]>;
  /**
   * Override the default preview area render
   *
   * If specified, the built-in viewer would not take effect.
   */
  overridePreview?(el: HTMLElement, props: ViewerProps): void;
  /**
   * Maximum length (number of characters) of value
   */
   maxLength?: number;
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
