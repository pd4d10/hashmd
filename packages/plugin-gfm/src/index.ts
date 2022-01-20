import type { BytemdPlugin } from 'bytemd'
import en from './locales/en.json'
import remarkGfm, { RemarkGfmOptions } from 'remark-gfm'
import { icons } from './icons'

export interface BytemdPluginGfmOptions extends RemarkGfmOptions {
  locale?: Partial<typeof en>
}

export default function gfm({
  locale: _locale,
  ...remarkGfmOptions
}: BytemdPluginGfmOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as typeof en

  return {
    remark: (p) => p.use(remarkGfm, remarkGfmOptions),
    actions: [
      {
        title: locale.strike,
        icon: icons.strikethrough,
        cheatsheet: `~~${locale.strikeText}~~`,
        handler: {
          type: 'action',
          click({ wrapText, editor }) {
            wrapText('~~')
            editor.focus()
          },
        },
      },
      {
        title: locale.task,
        icon: icons.task,
        cheatsheet: `- [ ] ${locale.taskText}`,
        handler: {
          type: 'action',
          click({ replaceLines, editor }) {
            replaceLines((line) => '- [ ] ' + line)
            editor.focus()
          },
        },
      },
      {
        title: locale.table,
        icon: icons.table,
        handler: {
          type: 'action',
          click({ editor, appendBlock, codemirror }) {
            const { line } = appendBlock(
              `| ${locale.tableHeading} |  |\n| --- | --- |\n|  |  |\n`
            )
            editor.setSelection(
              codemirror.Pos(line, 2),
              codemirror.Pos(line, 2 + locale.tableHeading.length)
            )
            editor.focus()
          },
        },
      },
    ],
  }
}
