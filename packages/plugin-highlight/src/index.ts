import { BytemdPlugin } from 'bytemd';
// @ts-ignore
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
    rehype: (u) => u.use(rehypeHighlight, { subset, ignoreMissing, ...rest }),
    sanitizeSchema: {
      attributes: {
        code: ['className'],
      },
    },
  };
}
