import { BytemdPlugin } from 'bytemd';
// @ts-ignore
import remarkMath from 'remark-math';
// @ts-ignore
import rehypeKatex from 'rehype-katex';
import { KatexOptions } from 'katex';

interface Options {
  math?: {
    inlineMathDouble?: boolean;
  };
  katex?: Omit<KatexOptions, 'displayMode'>;
}

export default function math(options: Options = {}): BytemdPlugin {
  return {
    remarkTransformer: (u) => u.use(remarkMath, options.math),
    rehypeTransformer: (u) => u.use(rehypeKatex, options.katex),
    markdownSanitizeSchema: {
      attributes: {
        div: ['className'],
        span: ['className'],
      },
    },
  };
}
