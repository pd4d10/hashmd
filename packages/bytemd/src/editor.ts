import { icons } from './icons'
import type {
  BytemdPlugin,
  BytemdAction,
  EditorProps,
  BytemdLocale,
  BytemdEditorContext,
} from './types'
import { EditorView } from 'codemirror'
import selectFiles from 'select-files'

/**
 * Wrap text with decorators, for example:
 *
 * `text -> *text*`
 */
export function wrapText(editor: EditorView, before: string, after = before) {
  const range =
    editor.state.selection.ranges.find((r) => !r.empty) ?? // only handle the first selection
    editor.state.wordAt(editor.state.selection.main.head)

  if (range) {
    const { from, to } = range
    const text = editor.state.sliceDoc(from, to) // use from/to instead of anchor/head for reverse select

    if (
      editor.state.sliceDoc(from - before.length, from) === before &&
      editor.state.sliceDoc(to, to + after.length) === after
    ) {
      editor.dispatch({
        changes: {
          from,
          to,
          insert: text.slice(before.length, -after.length),
        },
      })
    } else {
      editor.dispatch({
        changes: { from, to, insert: before + text + after },
      })

      // // select the original text
      // const cursor = view.getCursor()
      // view.setSelection(
      //   codemirror.Pos(cursor.line, cursor.ch - after.length - text.length),
      //   codemirror.Pos(cursor.line, cursor.ch - after.length),
      // )
    }
  }
}

/**
 * replace multiple lines
 *
 * `line -> # line`
 */
export function replaceLines(
  editor: EditorView,
  replace: Parameters<Array<string>['map']>[0],
) {
  const [selection] = editor.state.selection.ranges
  const { from } = editor.state.doc.lineAt(selection.from)
  const { to } = editor.state.doc.lineAt(selection.to)
  const lines = editor.state.sliceDoc(from, to).split('\n')

  editor.dispatch({
    changes: { from, to, insert: lines.map(replace).join('\n') },
  })
}

/**
 * Append a block based on the cursor position
 */
export function appendBlock(editor: EditorView, content: string) {
  const cursor = editor.state.selection.main.head
  // find the first blank line

  let emptyLine = -1
  for (
    let i = editor.state.doc.lineAt(cursor).number;
    i < editor.state.doc.lines;
    i++
  ) {
    if (!editor.state.doc.line(i).text.trim()) {
      emptyLine = i
      break
    }
  }

  let nextLine = editor.state.doc.lineAt(cursor).number + 1
  if (emptyLine === -1) {
    // insert a new line to the bottom
    editor.dispatch({
      changes: { from: nextLine, to: nextLine, insert: '\n' },
    })
    nextLine += 1
  }

  editor.dispatch({
    changes: { from: nextLine, to: nextLine, insert: content },
  })
}

export function findStartIndex(num: number, nums: number[]) {
  let startIndex = nums.length - 2
  for (let i = 0; i < nums.length; i++) {
    if (num < nums[i]) {
      startIndex = i - 1
      break
    }
  }
  startIndex = Math.max(startIndex, 0) // ensure >= 0
  return startIndex
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
  { editor }: BytemdEditorContext,
  uploadImages: NonNullable<EditorProps['uploadImages']>,
  files: File[],
) {
  const imgs = await uploadImages(files)
  const pos = appendBlock(
    editor,
    imgs
      .map(({ url, alt, title }, i) => {
        alt = alt ?? files[i].name
        return `![${alt}](${url}${title ? ` "${title}"` : ''})`
      })
      .join('\n\n'),
  )
  // editor.setSelection(pos, codemirror.Pos(pos.line + imgs.length * 2 - 2))
  editor.focus()
}

export function getBuiltinActions(
  locale: BytemdLocale,
  plugins: BytemdPlugin[],
  uploadImages: EditorProps['uploadImages'],
): { leftActions: BytemdAction[]; rightActions: BytemdAction[] } {
  const leftActions: BytemdAction[] = [
    {
      icon: icons.H,
      handler: {
        type: 'dropdown',
        actions: [1, 2, 3, 4, 5, 6].map((level) => ({
          title: locale[`h${level}` as keyof BytemdLocale],
          icon: [
            icons.H1,
            icons.H2,
            icons.H3,
            icons.LevelFourTitle,
            icons.LevelFiveTitle,
            icons.LevelSixTitle,
          ][level - 1],
          cheatsheet:
            level <= 3
              ? `${'#'.repeat(level)} ${locale.headingText}`
              : undefined,
          handler: {
            type: 'action',
            click({ editor }) {
              replaceLines(editor, (line) => {
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
    {
      title: locale.bold,
      icon: icons.TextBold,
      cheatsheet: `**${locale.boldText}**`,
      handler: {
        type: 'action',
        shortcut: getShortcutWithPrefix('B'),
        click({ editor }) {
          wrapText(editor, '**')
          editor.focus()
        },
      },
    },
    {
      title: locale.italic,
      icon: icons.TextItalic,
      cheatsheet: `*${locale.italicText}*`,
      handler: {
        type: 'action',
        shortcut: getShortcutWithPrefix('I'),
        click({ editor }) {
          wrapText(editor, '*')
          editor.focus()
        },
      },
    },
    {
      title: locale.quote,
      icon: icons.Quote,
      cheatsheet: `> ${locale.quotedText}`,
      handler: {
        type: 'action',
        click({ editor }) {
          replaceLines(editor, (line) => '> ' + line)
          editor.focus()
        },
      },
    },
    {
      title: locale.link,
      icon: icons.LinkOne,
      cheatsheet: `[${locale.linkText}](url)`,
      handler: {
        type: 'action',
        shortcut: getShortcutWithPrefix('K'),
        click({ editor }) {
          wrapText(editor, '[', '](url)')
          // const cursor = editor.getCursor()
          // editor.setSelection(
          //   codemirror.Pos(cursor.line, cursor.ch + 2),
          //   codemirror.Pos(cursor.line, cursor.ch + 5),
          // )
          editor.focus()
        },
      },
    },
    {
      title: locale.image,
      icon: icons.Pic,
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
                await handleImageUpload(ctx, uploadImages, Array.from(fileList))
              }
            },
          }
        : undefined,
    },
    {
      title: locale.code,
      icon: icons.Code,
      cheatsheet: '`' + locale.codeText + '`',
      handler: {
        type: 'action',
        shortcut: getShortcutWithPrefix('K', true),
        click({ editor }) {
          wrapText(editor, '`')
          editor.focus()
        },
      },
    },
    {
      title: locale.codeBlock,
      icon: icons.CodeBrackets,
      cheatsheet: '```' + locale.codeLang + '↵',
      handler: {
        type: 'action',
        shortcut: getShortcutWithPrefix('C', true),
        click({ editor }) {
          const pos = appendBlock(editor, '```js\n```')
          // editor.setSelection(
          //   codemirror.Pos(pos.line, 3),
          //   codemirror.Pos(pos.line, 5),
          // )
          editor.focus()
        },
      },
    },
    {
      title: locale.ul,
      icon: icons.ListTwo,
      cheatsheet: `- ${locale.ulItem}`,
      handler: {
        type: 'action',
        shortcut: getShortcutWithPrefix('U', true),
        click({ editor }) {
          replaceLines(editor, (line) => '- ' + line)
          editor.focus()
        },
      },
    },
    {
      title: locale.ol,
      icon: icons.OrderedList,
      cheatsheet: `1. ${locale.olItem}`,
      handler: {
        type: 'action',
        shortcut: getShortcutWithPrefix('O', true),
        click({ editor }) {
          replaceLines(editor, (line, i) => `${i + 1}. ${line}`)
          editor.focus()
        },
      },
    },
    {
      title: locale.hr,
      icon: icons.DividingLine,
      cheatsheet: '---',
    },
  ]
  const rightActions: BytemdAction[] = []
  plugins.forEach(({ actions }) => {
    if (actions) {
      actions.forEach((action) => {
        if (!action.position || action.position !== 'right')
          leftActions.push(action)
        else rightActions.unshift(action)
      })
    }
  })
  return {
    leftActions,
    rightActions,
  }
}
