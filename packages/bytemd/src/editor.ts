import { icons } from './icons'
import type {
  BytemdPlugin,
  BytemdAction,
  EditorProps,
  BytemdLocale,
  BytemdEditorContext,
} from './types'
import { EditorView } from '@codemirror/view'
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

    const shouldUnwrap = text.startsWith(before) && text.endsWith(after)
    editor.dispatch({
      changes: {
        from,
        to,
        insert: shouldUnwrap
          ? text.slice(before.length, -after.length)
          : before + text + after,
      },
      selection: {
        anchor: from,
        head: shouldUnwrap
          ? to - before.length - after.length
          : to + before.length + after.length,
      },
    })
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
  editor.dispatch({
    selection: {
      anchor: from,
      head: editor.state.doc.lineAt(selection.to).to, // recalculate here for updated position
    },
  })
}

/**
 * Append a block based on the cursor position
 */
export function appendBlock(
  editor: EditorView,
  content: string,
  { prefix = '', suffix = '' }: { prefix?: string; suffix?: string } = {},
) {
  prefix = '\n\n' + prefix
  suffix = suffix + '\n'

  const end = editor.state.doc.lineAt(editor.state.selection.main.head).to
  editor.dispatch({
    changes: { from: end, insert: prefix + content + suffix },
    selection: {
      anchor: end + prefix.length,
      head: end + prefix.length + content.length,
    },
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
      title: 'Headings',
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

if (import.meta.vitest) {
  const { test, expect, beforeEach, describe } = import.meta.vitest
  let cm: EditorView

  beforeEach(async () => {
    cm = new EditorView()
    return async () => {
      cm.destroy()
    }
  })

  describe('wrap text', () => {
    test('basic', () => {
      cm.dispatch({ changes: { from: 0, insert: 'text' } })

      wrapText(cm, '[', '](url)')
      expect(cm.state).matchSnapshot()
      wrapText(cm, '[', '](url)')
      expect(cm.state).matchSnapshot()
    })

    test('with selection', () => {
      cm.dispatch({ changes: { from: 0, insert: 'text' } })
      cm.dispatch({ selection: { anchor: 1, head: 3 } })

      wrapText(cm, '[', '](url)')
      expect(cm.state).matchSnapshot()
      wrapText(cm, '[', '](url)')
      expect(cm.state).matchSnapshot()
    })

    test('with same prefix and suffix', () => {
      cm.dispatch({ changes: { from: 0, insert: 'text' } })

      wrapText(cm, '*')
      expect(cm.state).matchSnapshot()
      wrapText(cm, '*')
      expect(cm.state).matchSnapshot()
    })
  })

  describe('replace lines', () => {
    test('basic', () => {
      cm.dispatch({ changes: { from: 0, insert: 'line1\nline2' } })

      replaceLines(cm, (line) => '> ' + line)
      expect(cm.state).matchSnapshot()
    })

    test('with selection', () => {
      cm.dispatch({ changes: { from: 0, insert: 'line1\nline2' } })
      cm.dispatch({ selection: { anchor: 2, head: 8 } })

      replaceLines(cm, (line) => '> ' + line)
      expect(cm.state).matchSnapshot()
    })
  })

  describe('append block', () => {
    test('basic', () => {
      cm.dispatch({ changes: { from: 0, insert: 'text' } })

      appendBlock(cm, 'block')
      expect(cm.state).matchSnapshot()
    })

    test('with prefix and suffix', () => {
      cm.dispatch({ changes: { from: 0, insert: 'text' } })

      appendBlock(cm, 'let x = 1', { prefix: '```js\n', suffix: '\n```' })
      expect(cm.state).matchSnapshot()
    })
  })
}
