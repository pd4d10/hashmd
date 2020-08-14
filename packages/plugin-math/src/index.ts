import { BytemdPlugin } from 'bytemd';
// @ts-ignore
import remarkMath from 'remark-math';
// @ts-ignore
import rehypeKatex from 'rehype-katex';

export interface MathOptions {
  inlineMathDouble?: boolean;
  katexOptions?: Omit<katex.KatexOptions, 'displayMode'>;
}

export default function math({
  inlineMathDouble,
  katexOptions = {},
}: MathOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath, { inlineMathDouble }),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
  };
}
