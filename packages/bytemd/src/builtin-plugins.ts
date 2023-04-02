import en from './locales/en.json'
import { icons } from './icons'
import type {
  BytemdPlugin,
  BytemdLocale,
  BytemdEditorContext,
  EditorProps,
} from './types'
import { ActionPosition } from './types'
import selectFiles from 'select-files'

export interface BytemdBuiltinPluginOptions {
  locale?: Partial<BytemdLocale>
  icon?: string
  position?: ActionPosition
}

const getShortcutWithPrefix = (key: string, shift = false) => {
  const shiftPrefix = shift ? 'Shift-' : ''
  const CmdPrefix =
    typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
      ? 'Cmd-'
      : 'Ctrl-'
  return shiftPrefix + CmdPrefix + key
}

export async function handleImageUpload(
  { editor, appendBlock, codemirror }: BytemdEditorContext,
  uploadImages: NonNullable<EditorProps['uploadImages']>,
  files: File[]
) {
  const images = await uploadImages(files)
  const pos = appendBlock(
    images
      .map(({ url, alt, title }, i) => {
        alt = alt ?? files[i].name
        return `![${alt}](${url}${title ? ` "${title}"` : ''})`
      })
      .join('\n\n')
  )
  editor.setSelection(pos, codemirror.Pos(pos.line + images.length * 2 - 2))
  editor.focus()
}

export interface HeadIconOptions {
  icon?: {
    h?: string
    h1?: string
    h2?: string
    h3?: string
    h4?: string
    h5?: string
    h6?: string
  }
}

export function head({
  locale: _locale,
  icon,
  position,
}: Omit<BytemdBuiltinPluginOptions, 'icon'> &
  HeadIconOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        icon: icon?.h ?? icons.H,
        position: position ?? ActionPosition.LEFT,
        handler: {
          type: 'dropdown',
          actions: [1, 2, 3, 4, 5, 6].map((level) => ({
            title: locale[`h${level}` as keyof BytemdLocale],
            icon: [
              icon?.h1 ?? icons.H1,
              icon?.h2 ?? icons.H2,
              icon?.h3 ?? icons.H3,
              icon?.h4 ?? icons.LevelFourTitle,
              icon?.h5 ?? icons.LevelFiveTitle,
              icon?.h6 ?? icons.LevelSixTitle,
            ][level - 1],
            cheatsheet:
              level <= 3
                ? `${'#'.repeat(level)} ${locale.headingText}`
                : undefined,
            handler: {
              type: 'action',
              click({ replaceLines, editor }) {
                replaceLines((line) => {
                  line = line.trim().replace(/^#*/, '').trim()
                  line = '#'.repeat(level) + ' ' + line
                  return line
                })
                editor.focus()
              },
            },
          })),
        },
      },
    ],
  }
}

export function bold({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.bold,
        icon: icon ?? icons.TextBold,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: `**${locale.boldText}**`,
        handler: {
          type: 'action',
          shortcut: getShortcutWithPrefix('B'),
          click({ wrapText, editor }) {
            wrapText('**')
            editor.focus()
          },
        },
      },
    ],
  }
}

export function italic({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.italic,
        icon: icon ?? icons.TextItalic,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: `*${locale.italicText}*`,
        handler: {
          type: 'action',
          shortcut: getShortcutWithPrefix('I'),
          click({ wrapText, editor }) {
            wrapText('*')
            editor.focus()
          },
        },
      },
    ],
  }
}

export function quote({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.quote,
        icon: icon ?? icons.Quote,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: `> ${locale.quotedText}`,
        handler: {
          type: 'action',
          click({ replaceLines, editor }) {
            replaceLines((line) => '> ' + line)
            editor.focus()
          },
        },
      },
    ],
  }
}

export function link({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.link,
        icon: icon ?? icons.LinkOne,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: `[${locale.linkText}](url)`,
        handler: {
          type: 'action',
          shortcut: getShortcutWithPrefix('K'),
          click({ editor, wrapText, codemirror }) {
            wrapText('[', '](url)')
            const cursor = editor.getCursor()
            editor.setSelection(
              codemirror.Pos(cursor.line, cursor.ch + 2),
              codemirror.Pos(cursor.line, cursor.ch + 5)
            )
            editor.focus()
          },
        },
      },
    ],
  }
}

export function image({
  locale: _locale,
  icon,
  position,
  uploadImages,
}: BytemdBuiltinPluginOptions & {
  uploadImages: EditorProps['uploadImages']
}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.image,
        icon: icon ?? icons.Pic,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: `![${locale.imageAlt}](url "${locale.imageTitle}")`,
        handler: uploadImages
          ? {
              type: 'action',
              shortcut: getShortcutWithPrefix('I', true),
              async click(ctx) {
                const fileList = await selectFiles({
                  accept: 'image/*',
                  multiple: true,
                })

                if (fileList?.length) {
                  await handleImageUpload(
                    ctx,
                    uploadImages,
                    Array.from(fileList)
                  )
                }
              },
            }
          : undefined,
      },
    ],
  }
}

export function code({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.code,
        icon: icon ?? icons.Code,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: '`' + locale.codeText + '`',
        handler: {
          type: 'action',
          shortcut: getShortcutWithPrefix('K', true),
          click({ wrapText, editor }) {
            wrapText('`')
            editor.focus()
          },
        },
      },
    ],
  }
}

export function codeBlock({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.codeBlock,
        icon: icon ?? icons.CodeBrackets,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: '```' + locale.codeLang + '↵',
        handler: {
          type: 'action',
          shortcut: getShortcutWithPrefix('C', true),
          click({ editor, appendBlock, codemirror }) {
            const pos = appendBlock('```js\n```')
            editor.setSelection(
              codemirror.Pos(pos.line, 3),
              codemirror.Pos(pos.line, 5)
            )
            editor.focus()
          },
        },
      },
    ],
  }
}

export function ul({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.ul,
        icon: icon ?? icons.ListTwo,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: `- ${locale.ulItem}`,
        handler: {
          type: 'action',
          shortcut: getShortcutWithPrefix('U', true),
          click({ replaceLines, editor }) {
            replaceLines((line) => '- ' + line)
            editor.focus()
          },
        },
      },
    ],
  }
}

export function ol({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.ol,
        icon: icon ?? icons.OrderedList,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: `1. ${locale.olItem}`,
        handler: {
          type: 'action',
          shortcut: getShortcutWithPrefix('O', true),
          click({ replaceLines, editor }) {
            replaceLines((line, i) => `${i + 1}. ${line}`)
            editor.focus()
          },
        },
      },
    ],
  }
}

export function hr({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.hr,
        icon: icon ?? icons.DividingLine,
        position: position ?? ActionPosition.LEFT,
        cheatsheet: '---',
      },
    ],
  }
}

export function toc({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        position: position ?? ActionPosition.RIGHT,
        create({ dispatch, sidebar }) {
          const active = sidebar === 'toc'
          return {
            title: active ? locale.closeToc : locale.toc,
            icon: icon ?? icons.AlignTextLeftOne,
            handler: {
              type: 'action',
              click() {
                dispatch('click', 'toc')
              },
            },
            active,
          }
        },
      },
    ],
  }
}

export function help({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        position: position ?? ActionPosition.RIGHT,
        create({ dispatch, sidebar }) {
          const active = sidebar === 'help'
          return {
            title: active ? locale.closeHelp : locale.help,
            icon: icon ?? icons.Helpcenter,
            handler: {
              type: 'action',
              click() {
                dispatch('click', 'help')
              },
            },
            active: active,
          }
        },
      },
    ],
  }
}

export function write({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        position: position ?? ActionPosition.RIGHT,
        create({ dispatch, activeTab, split }) {
          const active = activeTab === 'write'
          return {
            title: active ? locale.exitWriteOnly : locale.writeOnly,
            icon: icon ?? icons.LeftExpand,
            handler: {
              type: 'action',
              click() {
                dispatch('tab', 'write')
              },
            },
            active: active,
            hidden: !split,
          }
        },
      },
    ],
  }
}

export function preview({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        position: position ?? ActionPosition.RIGHT,
        create({ dispatch, activeTab, split }) {
          const active = activeTab === 'preview'
          return {
            title: active ? locale.exitPreviewOnly : locale.previewOnly,
            icon: icon ?? icons.RightExpand,
            handler: {
              type: 'action',
              click() {
                dispatch('tab', 'preview')
              },
            },
            active: active,
            hidden: !split,
          }
        },
      },
    ],
  }
}

export interface FullscreenIconOptions {
  icon?: {
    on?: string
    off?: string
  }
}

export function fullscreen({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions & FullscreenIconOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        position: position ?? ActionPosition.RIGHT,
        create({ dispatch, fullscreen }) {
          return {
            title: fullscreen ? locale.exitFullscreen : locale.fullscreen,
            icon: fullscreen
              ? icon?.on ?? icons.OffScreen
              : icon?.off ?? icons.FullScreen,
            handler: {
              type: 'action',
              click() {
                dispatch('click', 'fullscreen')
              },
            },
          }
        },
      },
    ],
  }
}

export function source({
  locale: _locale,
  icon,
  position,
}: BytemdBuiltinPluginOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as BytemdLocale
  return {
    actions: [
      {
        title: locale.source,
        icon: icon ?? icons.GithubOne,
        position: position ?? ActionPosition.RIGHT,
        handler: {
          type: 'action',
          click() {
            window.open('https://github.com/bytedance/bytemd')
          },
        },
      },
    ],
  }
}
