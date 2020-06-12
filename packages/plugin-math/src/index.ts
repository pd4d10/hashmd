import { BytemdPlugin } from 'bytemd';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function math(): BytemdPlugin {
  return {
    remarkTransformer: (u) => u.use(remarkMath),
    rehypeTransformer: (u) => u.use(rehypeKatex),
    markdownSanitizeSchema: {
      attributes: {
        div: ['className'],
        span: ['className'],
      },
    },
  };
}
