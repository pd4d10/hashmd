import type { BytemdPlugin } from 'bytemd';
import remarkMath, { RemarkMathOptions } from 'remark-math';
import rehypeKatex from 'rehype-katex';

export interface MathOptions extends RemarkMathOptions {
  katexOptions?: Omit<katex.KatexOptions, 'displayMode'>;
}

export default function math({
  katexOptions,
  ...remarkMathOptions
}: MathOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath, remarkMathOptions),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
  };
}
