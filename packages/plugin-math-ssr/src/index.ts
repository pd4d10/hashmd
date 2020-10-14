import type { BytemdPlugin } from 'bytemd';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export interface MathOptions {
  katexOptions?: Omit<katex.KatexOptions, 'displayMode'>;
}

export default function math({ katexOptions }: MathOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
  };
}
