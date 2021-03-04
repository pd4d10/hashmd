import type { BytemdPlugin } from 'bytemd';
import type { KatexOptions } from 'katex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import pluginMath from '@bytemd/plugin-math';
import en from './locales/en.json';

export interface BytemdPluginMathSsrOptions {
  locale?: typeof en;
  katexOptions?: Omit<KatexOptions, 'displayMode'>;
}

export default function mathSsr({
  locale = en,
  katexOptions,
}: BytemdPluginMathSsrOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
    actions: pluginMath({ locale }).actions,
  };
}
