import type { EditorView } from "@codemirror/view";
import type { Schema } from "hast-util-sanitize";
import type { Image } from "mdast";
import type { Options } from "remark-rehype";
import type { Processor } from "unified";
import type { VFile } from "vfile";

export interface Locale {
  write: string;
  preview: string;
  writeOnly: string;
  exitWriteOnly: string;
  previewOnly: string;
  exitPreviewOnly: string;
  help: string;
  closeHelp: string;
  toc: string;
  closeToc: string;
  fullscreen: string;
  exitFullscreen: string;
  source: string;
  cheatsheet: string;
  shortcuts: string;
  words: string;
  lines: string;
  sync: string;
  top: string;
  limited: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  headingText: string;
  bold: string;
  boldText: string;
  italic: string;
  italicText: string;
  quote: string;
  quotedText: string;
  link: string;
  linkText: string;
  image: string;
  imageAlt: string;
  imageTitle: string;
  code: string;
  codeText: string;
  codeBlock: string;
  codeLang: string;
  ul: string;
  ulItem: string;
  ol: string;
  olItem: string;
  hr: string;
}

export interface EditorContext {
  /**
   * CodeMirror editor instance
   */
  editor: EditorView;
}

export interface ViewerContext {
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

interface ToolbarCommon {
  /**
   * Toolbar title
   */
  title: string;
  /**
   * Toolbar icon (16x16), usually inline svg
   */
  icon: string;
  /**
   *
   */
  active?: boolean;
}

export interface Action {
  /**
   * Action title
   */
  title: string;
  /**
   * Click event handler
   */
  click: EventListener;
  /**
   * Markdown syntax cheatsheet
   *
   * If specified, this record will be added to the Markdown cheatsheet section
   */
  cheatsheet?: string;
  /**
   * Keyboard shortcut
   *
   * If specified, this shortcut will bind to click listener
   * and will be added to the Keyboard shortcut section
   *
   * https://codemirror.net/doc/manual.html#keymaps
   */
  shortcut?: string;
  mouseenter?: EventListener;
  mouseleave?: EventListener;
}

export interface ToolbarActionSingle extends ToolbarCommon, Action {
  type: "single";
}

export interface ToolbarActionMultiple extends ToolbarCommon {
  type: "multiple";
  title: string;
  actions: Action[];
}

export interface ToolbarDivider {
  type: "divider";
}

export interface ToolbarSpace {
  type: "space";
}

export type ToolbarItem =
  | ToolbarActionSingle
  | ToolbarActionMultiple
  | ToolbarDivider
  | ToolbarSpace;

export type ToolbarActionHandler = {};

type EventListener = (e: CustomEvent<EditorContext>) => void;

export interface Plugin {
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
  toolbar?: ToolbarItem[];
  /**
   * Side effect for the editor, triggers when plugin changes
   */
  editorEffect?(ctx: EditorContext): void | (() => void);
  /**
   * Side effect for the viewer, triggers when viewer props changes
   */
  viewerEffect?(ctx: ViewerContext): void | (() => void);
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
  mode?: "split" | "tab" | "auto";
  /**
   * Debounce time (ms) for preview
   *
   * @defaultValue 300
   */
  previewDebounce?: number;
  /**
   * i18n locale
   *
   * @defaultValue en
   */
  locale?: Partial<Locale>;
  /**
   * Handle images upload
   */
  uploadImages?: (
    files: File[],
  ) => Promise<Pick<Image, "url" | "alt" | "title">[]>;
}

export interface ViewerProps {
  /**
   * Markdown text
   */
  value: string;
  /**
   * Plugin list
   */
  plugins?: Plugin[];
  /**
   * Sanitize strategy: Defaults to GitHub style sanitation with class names allowed
   *
   * https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/github.json
   *
   * If you want further customization, pass a function to mutate sanitize schema.
   */
  sanitize?: (schema: Schema) => Schema;
  /**
   * custom remark-rehype options: Defaults value { allowDangerousHtml: true }
   *
   * https://github.com/remarkjs/remark-rehype
   */
  remarkRehype?: Options;
}
