import { BytemdPlugin } from 'bytemd';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
// @ts-ignore
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';

export interface Html2mdOptions {
  rehype?: (p: unified.Processor) => unified.Processor;
  remark?: (p: unified.Processor) => unified.Processor;
  rehypeParseOptions?: rehypeParse.RehypeParseOptions;
  remarkStringifyOptions?: remarkStringify.PartialRemarkStringifyOptions;
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
