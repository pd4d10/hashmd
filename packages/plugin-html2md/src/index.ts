import { BytemdPlugin } from 'bytemd';
import { Editor } from 'codemirror';
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
      const handleItems = async (
        items: DataTransferItem[],
        e: ClipboardEvent | DragEvent
      ) => {
        const htmlItem = items.find((item) => item.type === 'text/html');
        if (htmlItem) {
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

          let p = unified().use(rehypeParse, rehypeParseOptions);
          p = rehype?.(p) ?? p;
          p = p.use(rehypeRemark);
          p = remark?.(p) ?? p;
          p = p.use(remarkStringify, remarkStringifyOptions);
          const result = await p.process(html);
          cm.replaceSelection(result.toString());
        }
      };

      const handlePaste = async (_: Editor, e: ClipboardEvent) => {
        handleItems(Array.from(e.clipboardData?.items ?? []), e);
      };

      const handleDrop = async (cm: Editor, e: DragEvent) => {
        handleItems(Array.from(e.dataTransfer?.items ?? []), e);
      };

      cm.on('paste', handlePaste);
      cm.on('drop', handleDrop);

      return () => {
        cm.off('paste', handlePaste);
        cm.off('drop', handleDrop);
      };
    },
  };
}
