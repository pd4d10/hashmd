import type { BytemdPlugin } from 'bytemd';
import type { Processor } from 'unified';
import type { RehypeParseOptions } from 'rehype-parse';
import type { RemarkStringifyOptions } from 'remark-stringify';

export interface ImportHtmlOptions {
  transformers?: ImportHtmlTransformer[];
  rehypeParseOptions?: RehypeParseOptions;
  remarkStringifyOptions?: RemarkStringifyOptions;
  getDataFromEvent?: (
    e: ClipboardEvent | DragEvent
  ) => DataTransferItem | undefined;
}

export interface ImportHtmlTransformer {
  test: (html: string) => boolean;
  rehype?: (p: Processor) => Processor;
  remark?: (p: Processor) => Processor;
}
export default function importHtml({
  transformers,
  rehypeParseOptions,
  remarkStringifyOptions,
  getDataFromEvent = (e) => {
    const itemList = Array.from(
      (e instanceof ClipboardEvent
        ? e.clipboardData?.items
        : e.dataTransfer?.items) ?? []
    );
    return itemList.find((item) => item.type === 'text/html');
  },
}: ImportHtmlOptions = {}): BytemdPlugin {
  return {
    editorEffect({ editor }) {
      const handler = async (
        _: CodeMirror.Editor,
        e: ClipboardEvent | DragEvent
      ) => {
        const htmlItem = getDataFromEvent(e);
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
        ] = await Promise.all([
          import('unified'),
          import('rehype-parse'),
          // @ts-ignore
          import('rehype-remark'),
          import('remark-stringify'),
        ]);

        let processor = unified().use(rehypeParse, rehypeParseOptions);
        transformers?.forEach(({ test, rehype }) => {
          if (test(html) && rehype) processor = rehype(processor);
        });
        processor = processor.use(rehypeRemark);
        transformers?.forEach(({ test, remark }) => {
          if (test(html) && remark) processor = remark(processor);
        });
        processor = processor.use(remarkStringify, remarkStringifyOptions);

        const result = await processor.process(html);
        editor.replaceSelection(result.toString());
      };

      editor.on('paste', handler);
      editor.on('drop', handler);

      return () => {
        editor.off('paste', handler);
        editor.off('drop', handler);
      };
    },
  };
}
