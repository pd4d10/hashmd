import type { BytemdPlugin } from 'bytemd'
import remarkMath from 'remark-math'
import rehypeKatex, { Options } from 'rehype-katex'
import { MathLocale, getMathActions } from '@bytemd/utils'
import en from '../locales/en.json'

export interface BytemdPluginMathSsrOptions {
  locale?: Partial<MathLocale>
  katexOptions?: Omit<Options, 'displayMode'>
}

export default function mathSsr({
  locale: _locale,
  katexOptions,
}: BytemdPluginMathSsrOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale }
  return {
    remark: (u) => u.use(remarkMath),
    rehype: (u) => u.use(rehypeKatex, katexOptions),
    actions: getMathActions(locale),
  }
}
