import { BytemdPlugin } from 'bytemd';
import remarkFootnotes from 'remark-footnotes';

export default function footnotes(options?: {
  inlineNotes?: boolean;
}): BytemdPlugin {
  return {
    remarkTransformer: (u) => u.use(remarkFootnotes, options),
    markdownSanitizeSchema: {
      attributes: {
        div: ['className'],
        a: ['className'],
      },
    },
  };
}
