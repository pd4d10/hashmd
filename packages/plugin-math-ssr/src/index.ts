import type { BytemdPlugin } from 'bytemd'
import remarkMath from 'remark-math'
import rehypeKatex, { Options } from 'rehype-katex'
import pluginMath from '@bytemd/plugin-math'
import en from './locales/en.json'

type Locale = {
  inline: string
  inlineText: string
  block: string
  blockText: string
}

export interface BytemdPluginMathSsrOptions {
  locale?: Partial<Locale>
  katexOptions?: Omit<Options, 'displayMode'>
}

export default function mathSsr({
  locale: _locale,
  katexOptions,
}: BytemdPluginMathSsrOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as Locale
  return {
    remark: (u) => u.use(remarkMath),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
    actions: pluginMath({ locale }).actions,
  }
}
