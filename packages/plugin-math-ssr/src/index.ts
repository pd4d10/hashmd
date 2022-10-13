import en from './locales/en.json'
import { MathLocale, getMathActions } from './utils'
import type { BytemdPlugin } from 'bytemd'
import rehypeKatex, { Options } from 'rehype-katex'
import remarkMath from 'remark-math'

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
