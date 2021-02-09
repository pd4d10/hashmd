import type { BytemdPlugin } from 'bytemd';
// @ts-ignore
import rehypeHighlight from 'rehype-highlight';

export interface BytemdPluginHighlightSsrOptions {
  prefix?: string;
  subset?: boolean | string[];
  ignoreMissing?: boolean;
  plainText?: string[];
  aliases?: Record<string, string[]>;
}

export default function highlight({
  subset = false,
  ignoreMissing = true,
  ...rest
}: BytemdPluginHighlightSsrOptions = {}): BytemdPlugin {
  return {
    rehype: (u) => u.use(rehypeHighlight, { subset, ignoreMissing, ...rest }),
  };
}
