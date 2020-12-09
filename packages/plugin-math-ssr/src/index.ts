import type { BytemdPlugin } from 'bytemd';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { icons } from './icons';

export interface MathOptions {
  katexOptions?: Omit<katex.KatexOptions, 'displayMode'>;
}

export default function math({ katexOptions }: MathOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
    toolbar: {
      math: {
        tooltip: 'Math formula',
        icon: icons.formula,
        onClick({ utils }) {
          utils.replaceLines((lines) => ['$$', ...lines, '$$']);
        },
      },
    },
  };
}
