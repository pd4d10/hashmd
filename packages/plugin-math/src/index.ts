import type { BytemdPlugin } from 'bytemd'
import type { default as K, KatexOptions } from 'katex'
import remarkMath from 'remark-math'
import { MathLocale, getMathActions } from './utils'
import en from './locales/en.json'

export interface BytemdPluginMathOptions {
  locale?: Partial<MathLocale>
  katexOptions?: Omit<KatexOptions, 'displayMode'>
}

export default function math({
  locale: _locale,
  katexOptions,
}: BytemdPluginMathOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale }
  let katex: typeof K

  return {
    remark: (processor) => processor.use(remarkMath),
    viewerEffect({ markdownBody }) {
      const renderMath = async (selector: string, displayMode: boolean) => {
        const els = markdownBody.querySelectorAll<HTMLElement>(selector)
        if (els.length === 0) return

        if (!katex) {
          katex = await import('katex').then((m) => m.default)
        }

        els.forEach((el) => {
          katex.render(el.innerText, el, {
            ...katexOptions,
            throwOnError: false,
            displayMode,
          })
        })
      }

      renderMath('.math.math-inline', false)
      renderMath('.math.math-display', true)
    },
    actions: getMathActions(locale),
  }
}
