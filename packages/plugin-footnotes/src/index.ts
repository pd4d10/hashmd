import { BytemdPlugin } from 'bytemd';
import remarkFootnotes from 'remark-footnotes';

export default function footnotes(): BytemdPlugin {
  return {
    remarkTransformer: (u) => u.use(remarkFootnotes),
    markdownSanitizeSchema: {
      attributes: {
        div: ['className'],
        a: ['className'],
      },
    },
  };
}
