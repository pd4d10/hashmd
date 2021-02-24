import type { BytemdPlugin } from 'bytemd';
import type { KatexOptions } from 'katex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import pluginMath from '@bytemd/plugin-math';
import enUS, { Locale } from '@bytemd/plugin-math/lib/locales/en-US';

export interface BytemdPluginMathSsrOptions {
  locale?: Locale;
  katexOptions?: Omit<KatexOptions, 'displayMode'>;
}

export default function mathSsr({
  locale = enUS,
  katexOptions,
}: BytemdPluginMathSsrOptions = {}): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkMath),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
    action: pluginMath({ locale }).action,
  };
}
