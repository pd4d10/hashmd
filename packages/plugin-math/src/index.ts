import type { BytemdPlugin } from 'bytemd'
import type * as K from 'katex'
import remarkMath from 'remark-math'
import { icons } from './icons'
import en from './locales/en.json'

type Locale = {
  inline: string
  inlineText: string
  block: string
  blockText: string
}

export interface BytemdPluginMathOptions {
  locale?: Partial<Locale>
  katexOptions?: Omit<K.KatexOptions, 'displayMode'>
}

export default function math({
  locale: _locale,
  katexOptions,
}: BytemdPluginMathOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as Locale
  let katex: typeof K

  return {
    remark: (p) => p.use(remarkMath),
    viewerEffect({ markdownBody }) {
      const renderMath = async (selector: string, displayMode: boolean) => {
        const els = markdownBody.querySelectorAll<HTMLElement>(selector)
        if (els.length === 0) return

        if (!katex) {
          katex = await import('katex')
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
    actions: [
      {
        icon: icons.math,
        handler: {
          type: 'dropdown',
          actions: [
            {
              title: locale.inline,
              icon: icons.inline,
              cheatsheet: `$${locale.inlineText}$`,
              handler: {
                type: 'action',
                click({ wrapText, editor }) {
                  wrapText('$')
                  editor.focus()
                },
              },
            },
            {
              title: locale.block,
              icon: icons.block,
              cheatsheet: `$$↵${locale.blockText}↵$$`,
              handler: {
                type: 'action',
                click({ appendBlock, editor, codemirror }) {
                  const { line } = appendBlock('$$\n\\TeX\n$$')
                  editor.setSelection(
                    codemirror.Pos(line + 1, 0),
                    codemirror.Pos(line + 1, 4)
                  )
                  editor.focus()
                },
              },
            },
          ],
        },
      },
    ],
  }
}
