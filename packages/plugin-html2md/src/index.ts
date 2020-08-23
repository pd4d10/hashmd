import { BytemdPlugin } from 'bytemd';
import { Processor } from 'unified';
import { RehypeParseOptions } from 'rehype-parse';
import { PartialRemarkStringifyOptions } from 'remark-stringify';

export interface Html2mdOptions {
  rehype?: (p: Processor) => Processor;
  remark?: (p: Processor) => Processor;
  rehypeParseOptions?: RehypeParseOptions;
  remarkStringifyOptions?: PartialRemarkStringifyOptions;
}

export default function html2md({
  rehype,
  remark,
  rehypeParseOptions,
  remarkStringifyOptions,
}: Html2mdOptions = {}): BytemdPlugin {
  return {
    editorEffect(cm) {
      const handler = async (
        _: CodeMirror.Editor,
        e: ClipboardEvent | DragEvent
      ) => {
        const itemList =
          e instanceof ClipboardEvent
            ? e.clipboardData?.items
            : e.dataTransfer?.items;
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
        processor = rehype?.(processor) ?? processor;
        processor = processor.use(rehypeRemark);
        processor = remark?.(processor) ?? processor;
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
