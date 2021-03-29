import type { BytemdPlugin } from 'bytemd';
import remarkMdx from 'remark-mdx';

export interface BytemdPluginMdxOptions {}

export default function math({}: BytemdPluginMdxOptions = {}): BytemdPlugin {
  return {
    remark: (p) => p.use(remarkMdx),
    viewerEffect({ markdownBody }) {
      // TODO:
    },
  };
}
