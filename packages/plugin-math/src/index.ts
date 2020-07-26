import { BytemdPlugin } from 'bytemd';
// @ts-ignore
import remarkMath from 'remark-math';
// @ts-ignore
import rehypeKatex from 'rehype-katex';
import { KatexOptions } from 'katex';

export interface MathOptions {
  inlineMathDouble?: boolean;
  katex?: Omit<KatexOptions, 'displayMode'>;
}

export default function math({
  inlineMathDouble,
  katex,
}: MathOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath, { inlineMathDouble }),
    rehype: (u) => u.use(rehypeKatex, katex),
  };
}
