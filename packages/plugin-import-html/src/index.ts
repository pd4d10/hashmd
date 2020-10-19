import type { BytemdPlugin } from 'bytemd';
import type { Processor } from 'unified';
import type { RemarkStringifyOptions } from 'remark-stringify';

export interface ImportHtmlOptions {
  /**
   * Process HTML before being converted to markdown
   */
  rehype?: (p: Processor) => Processor;
  /**
   * Output markdown text format
   *
   * https://github.com/syntax-tree/mdast-util-to-markdown#tomarkdowntree-options
   */
  markdownFormat?: RemarkStringifyOptions;
}

export default function importHtml({
  rehype,
  markdownFormat = {
    fences: true,
    listItemIndent: 'one',
  },
}: ImportHtmlOptions = {}): BytemdPlugin {
  const handler = async (
    editor: CodeMirror.Editor,
    e: ClipboardEvent | DragEvent
  ) => {
    const items = Array.from(
      (e instanceof ClipboardEvent
        ? e.clipboardData?.items
        : e.dataTransfer?.items) ?? []
    );

    // fix: text copied from VSCode would have a `vscode-editor-data` type, exclude this case
    if (items.length !== 2) return;

    const htmlItem = items.find((item) => item.type === 'text/html');
    if (!htmlItem) return;

    e.preventDefault();

    let html: string;
    switch (htmlItem.kind) {
      case 'string': {
        html = await new Promise<string>((resolve) =>
          htmlItem.getAsString((v) => {
            resolve(v);
          })
        );
        break;
      }
      case 'file': {
        html = await htmlItem.getAsFile()!.text();
        break;
      }
      default: {
        throw new Error();
      }
    }

    // console.log(html);

    const [
      { default: unified },
      { default: rehypeParse },
      { default: rehypeRemark },
      { default: remarkStringify },
      { default: remarkGfm },
      { toMarkdown: gfmExt },
    ] = await Promise.all([
      import('unified'),
      import('rehype-parse'),
      // @ts-ignore
      import('rehype-remark'),
      import('remark-stringify'),
      import('remark-gfm'),
      // @ts-ignore
      import('mdast-util-gfm'),
    ]);

    let processor = unified().use(rehypeParse);
    if (rehype) {
      processor = rehype(processor);
    }
    processor = processor
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(remarkStringify, {
        ...markdownFormat,
        listItemIndent: 'one',
        extensions: [gfmExt()],
      });

    const result = await processor.process(html);
    editor.replaceSelection(result.toString());
  };

  return {
    editorEffect({ editor }) {
      editor.on('paste', handler);
      editor.on('drop', handler);

      return () => {
        editor.off('paste', handler);
        editor.off('drop', handler);
      };
    },
  };
}
