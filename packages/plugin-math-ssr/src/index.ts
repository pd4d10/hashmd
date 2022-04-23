import type { BytemdPlugin } from 'bytemd'
import remarkMath from 'remark-math'
import rehypeKatex, { Options } from 'rehype-katex'
import { MathLocale, getMathActions } from './utils'
import en from './locales/en.json'

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
    remark: (processor) => processor.use(remarkMath),
    rehype: (processor) => processor.use(rehypeKatex, katexOptions),
    actions: getMathActions(locale),
  }
}
