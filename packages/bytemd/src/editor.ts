import type {
  BytemdPlugin,
  BytemdAction,
  BytemdActionFactory,
} from './types'
import type { Editor, Position } from 'codemirror'
import type CodeMirror from 'codemirror'
import factory from 'codemirror-ssr'
import usePlaceholder from 'codemirror-ssr/addon/display/placeholder.js'
import useContinuelist from 'codemirror-ssr/addon/edit/continuelist.js'
import useOverlay from 'codemirror-ssr/addon/mode/overlay.js'
import useGfm from 'codemirror-ssr/mode/gfm/gfm.js'
import useMarkdown from 'codemirror-ssr/mode/markdown/markdown.js'
import useXml from 'codemirror-ssr/mode/xml/xml.js'
import useYamlFrontmatter from 'codemirror-ssr/mode/yaml-frontmatter/yaml-frontmatter.js'
import useYaml from 'codemirror-ssr/mode/yaml/yaml.js'
import selectFiles from 'select-files'

export function createCodeMirror() {
  const codemirror = factory()
  usePlaceholder(codemirror)
  useOverlay(codemirror)
  useXml(codemirror) // inline html highlight
  useMarkdown(codemirror)
  useGfm(codemirror)
  useYaml(codemirror)
  useYamlFrontmatter(codemirror)
  useContinuelist(codemirror)
  return codemirror
}

export type EditorUtils = ReturnType<typeof createEditorUtils>

export function createEditorUtils(
  codemirror: typeof CodeMirror,
  editor: Editor
) {
  return {
    /**
     * Wrap text with decorators, for example:
     *
     * `text -> *text*`
     */
    wrapText(before: string, after = before) {
      const range = editor.somethingSelected()
        ? editor.listSelections()[0] // only handle the first selection
        : editor.findWordAt(editor.getCursor())

      const from = range.from() // use from/to instead of anchor/head for reverse select
      const to = range.to()
      const text = editor.getRange(from, to)
      const fromBefore = codemirror.Pos(from.line, from.ch - before.length)
      const toAfter = codemirror.Pos(to.line, to.ch + after.length)

      if (
        editor.getRange(fromBefore, from) === before &&
        editor.getRange(to, toAfter) === after
      ) {
        editor.replaceRange(text, fromBefore, toAfter)
        editor.setSelection(
          fromBefore,
          codemirror.Pos(fromBefore.line, fromBefore.ch + text.length)
        )
      } else {
        editor.replaceRange(before + text + after, from, to)

        // select the original text
        const cursor = editor.getCursor()
        editor.setSelection(
          codemirror.Pos(cursor.line, cursor.ch - after.length - text.length),
          codemirror.Pos(cursor.line, cursor.ch - after.length)
        )
      }
    },
    /**
     * replace multiple lines
     *
     * `line -> # line`
     */
    replaceLines(replace: Parameters<Array<string>['map']>[0]) {
      const [selection] = editor.listSelections()

      const range = [
        codemirror.Pos(selection.from().line, 0),
        codemirror.Pos(selection.to().line),
      ] as const
      const lines = editor.getRange(...range).split('\n')
      editor.replaceRange(lines.map(replace).join('\n'), ...range)
      editor.setSelection(...range)
    },
    /**
     * Append a block based on the cursor position
     */
    appendBlock(content: string): Position {
      const cursor = editor.getCursor()
      // find the first blank line

      let emptyLine = -1
      for (let i = cursor.line; i < editor.lineCount(); i++) {
        if (!editor.getLine(i).trim()) {
          emptyLine = i
          break
        }
      }
      if (emptyLine === -1) {
        // insert a new line to the bottom
        editor.replaceRange('\n', codemirror.Pos(editor.lineCount()))
        emptyLine = editor.lineCount()
      }

      editor.replaceRange('\n' + content, codemirror.Pos(emptyLine))
      return codemirror.Pos(emptyLine + 1, 0)
    },
    /**
     * Triggers a virtual file input and let user select files
     *
     * https://www.npmjs.com/package/select-files
     */
    selectFiles,
  }
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

export function getActions(plugins: BytemdPlugin[]) {
  const leftActions: Array<BytemdAction | BytemdActionFactory> = []
  const rightActions: Array<BytemdAction | BytemdActionFactory> = []
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
