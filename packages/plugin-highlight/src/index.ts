import { BytemdPlugin } from 'bytemd';
import rehypeHighlight from 'rehype-highlight';

interface HighlightOptions {
  prefix?: string;
  subset?: boolean | string[];
  ignoreMissing?: boolean;
  plainText?: string[];
  aliases?: Record<string, string[]>;
}

const defaults: HighlightOptions = { subset: false, ignoreMissing: true };

export default function highlight({
  subset = false,
  ignoreMissing = true,
  ...rest
}: HighlightOptions = {}): BytemdPlugin {
  return {
    rehypeTransformer: (u) =>
      u.use(rehypeHighlight, { subset, ignoreMissing, ...rest }),
    markdownSanitizeSchema: {
      attributes: {
        code: ['className'],
      },
    },
  };
}
