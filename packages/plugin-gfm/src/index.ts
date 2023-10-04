import { icons } from './icons'
import en from './locales/en.json'
import { appendBlock, replaceLines, type BytemdPlugin, wrapText } from 'bytemd'
import remarkGfm, { Options } from 'remark-gfm'

type Locale = {
  strike: string
  strikeText: string
  task: string
  taskText: string
  table: string
  tableHeading: string
}

export interface BytemdPluginGfmOptions extends Options {
  locale?: Partial<Locale>
}

export default function gfm({
  locale: _locale,
  ...remarkGfmOptions
}: BytemdPluginGfmOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as Locale

  return {
    remark: (processor) => processor.use(remarkGfm, remarkGfmOptions),
    actions: [
      {
        title: locale.strike,
        icon: icons.Strikethrough,
        cheatsheet: `~~${locale.strikeText}~~`,
        handler: {
          type: 'action',
          click({ editor }) {
            wrapText(editor, '~~')
          },
        },
      },
      {
        title: locale.task,
        icon: icons.CheckCorrect,
        cheatsheet: `- [ ] ${locale.taskText}`,
        handler: {
          type: 'action',
          click({ editor }) {
            replaceLines(editor, (line) => '- [ ] ' + line)
          },
        },
      },
      {
        title: locale.table,
        icon: icons.InsertTable,
        handler: {
          type: 'action',
          click({ editor }) {
            appendBlock(editor, locale.tableHeading, {
              prefix: '| ',
              suffix: ` |  |
| --- | --- |
|  |  |`,
            })
          },
        },
      },
    ],
  }
}
