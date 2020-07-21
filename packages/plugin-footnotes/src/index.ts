import { BytemdPlugin } from 'bytemd';
// @ts-ignore
import remarkFootnotes from 'remark-footnotes';

export default function footnotes(options?: {
  inlineNotes?: boolean;
}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkFootnotes, options),
  };
}
