import type { BytemdPlugin } from 'bytemd';
import type { Processor } from 'unified';
import type { RehypeParseOptions } from 'rehype-parse';
import type { PartialRemarkStringifyOptions } from 'remark-stringify';

export interface ImportHtmlOptions {
  transformers?: ImportHtmlTransformer[];
  rehypeParseOptions?: RehypeParseOptions;
  remarkStringifyOptions?: PartialRemarkStringifyOptions;
  transformersAll?: boolean;
}

export interface ImportHtmlTransformer {
  test: (html: string) => boolean;
  rehype?: (p: Processor) => Processor;
  remark?: (p: Processor) => Processor;
}
const normalClipboardItemTypes = ['text/plain', 'text/html'];
export default function importHtml({
  transformers,
  rehypeParseOptions,
  remarkStringifyOptions,
  transformersAll = false,
}: ImportHtmlOptions = {}): BytemdPlugin {
  return {
    editorEffect(cm) {
      const handler = async (
        _: CodeMirror.Editor,
        e: ClipboardEvent | DragEvent
      ) => {
        const itemList = Array.from(
          (e instanceof ClipboardEvent
            ? e.clipboardData?.items
            : e.dataTransfer?.items) ?? []
        );
        // 默认不转换 clipboardData 含有其他特殊标记数据的
        if (
          !transformersAll &&
          itemList.find(({ type }) => !normalClipboardItemTypes.includes(type))
        ) {
          return;
        }
        const htmlItem = Array.from(itemList ?? []).find(
          (item) => item.type === 'text/html'
        );
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
        cm.replaceSelection(result.toString());
      };

      cm.on('paste', handler);
      cm.on('drop', handler);

      return () => {
        cm.off('paste', handler);
        cm.off('drop', handler);
      };
    },
  };
}
