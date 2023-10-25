import { icons } from "./icons";
import type { EditorProps, Locale, EditorContext, ToolbarItem } from "./types";
import { EditorView } from "@codemirror/view";
import selectFiles from "select-files";

/**
 * Wrap text with decorators, for example:
 *
 * `text -> *text*`
 */
export function wrapText(editor: EditorView, prefix: string, suffix = prefix) {
  const selection =
    editor.state.selection.ranges.find((r) => !r.empty) ?? // find the first selection
    editor.state.wordAt(editor.state.selection.main.head) ?? // if not, try to find the word
    editor.state.selection.main;

  const { from, to } = selection;
  const text = editor.state.sliceDoc(from, to); // use from/to instead of anchor/head for reverse select

  const shouldUnwrap =
    editor.state.sliceDoc(from - prefix.length, from) === prefix &&
    editor.state.sliceDoc(to, to + suffix.length) === suffix;
  if (shouldUnwrap) {
    editor.dispatch({
      changes: {
        from: from - prefix.length,
        to: to + suffix.length,
        insert: text,
      },
      selection: {
        anchor: from - prefix.length,
        head: to - prefix.length,
      },
    });
  } else {
    editor.dispatch({
      changes: { from, to, insert: prefix + text + suffix },
      selection: {
        anchor: from + prefix.length,
        head: to + prefix.length,
      },
    });
  }
  editor.focus();
}

/**
 * replace multiple lines
 *
 * `line -> # line`
 */
export function replaceLines(
  editor: EditorView,
  replace: Parameters<Array<string>["map"]>[0],
) {
  const [selection] = editor.state.selection.ranges;
  const { from } = editor.state.doc.lineAt(selection.from);
  const { to } = editor.state.doc.lineAt(selection.to);
  const lines = editor.state.sliceDoc(from, to).split("\n");

  editor.dispatch({
    changes: { from, to, insert: lines.map(replace).join("\n") },
  });
  editor.dispatch({
    selection: {
      anchor: from,
      head: editor.state.doc.lineAt(selection.to).to, // recalculate here for updated position
    },
  });
  editor.focus();
}

/**
 * Append a block based on the cursor position
 */
export function appendBlock(
  editor: EditorView,
  content: string,
  { prefix = "", suffix = "" }: { prefix?: string; suffix?: string } = {},
) {
  prefix = "\n\n" + prefix;
  suffix = suffix + "\n";

  const end = editor.state.doc.lineAt(editor.state.selection.main.head).to;
  editor.dispatch({
    changes: { from: end, insert: prefix + content + suffix },
    selection: {
      anchor: end + prefix.length,
      head: end + prefix.length + content.length,
    },
  });
  editor.focus();
}

export function findStartIndex(num: number, nums: number[]) {
  let startIndex = nums.length - 2;
  for (let i = 0; i < nums.length; i++) {
    if (num < nums[i]) {
      startIndex = i - 1;
      break;
    }
  }
  startIndex = Math.max(startIndex, 0); // ensure >= 0
  return startIndex;
}

export const getShortcutWithPrefix = (key: string, shift = false) => {
  const shiftPrefix = shift ? "Shift-" : "";
  const CmdPrefix =
    typeof navigator !== "undefined" && /Mac/.test(navigator.platform)
      ? "Cmd-"
      : "Ctrl-";
  return shiftPrefix + CmdPrefix + key;
};

export async function handleImageUpload(
  { editor }: EditorContext,
  uploadImages: NonNullable<EditorProps["uploadImages"]>,
  files: File[],
) {
  const imgs = await uploadImages(files);
  appendBlock(
    editor,
    imgs
      .map(({ url, alt, title }, i) => {
        alt = alt ?? files[i].name;
        return `![${alt}](${url}${title ? ` "${title}"` : ""})`;
      })
      .join("\n\n"),
  );
}

export function getLeftItems(locale: Locale): ToolbarItem[] {
  return [
    {
      type: "multiple",
      title: "Headings",
      icon: icons.heading,
      actions: [1, 2, 3, 4, 5, 6].map((level) => ({
        title: locale[`h${level}` as keyof Locale],
        cheatsheet:
          level <= 3 ? `${"#".repeat(level)} ${locale.headingText}` : undefined,
        click({ detail: { editor } }) {
          replaceLines(editor, (line) => {
            line = line.trim().replace(/^#*/, "").trim();
            line = "#".repeat(level) + " " + line;
            return line;
          });
        },
      })),
    },
    {
      type: "single",
      title: locale.bold,
      icon: icons.bold,
      cheatsheet: `**${locale.boldText}**`,
      shortcut: getShortcutWithPrefix("B"),
      click({ detail: { editor } }) {
        wrapText(editor, "**");
      },
    },
    {
      type: "single",
      title: locale.italic,
      icon: icons.italic,
      cheatsheet: `*${locale.italicText}*`,
      shortcut: getShortcutWithPrefix("I"),
      click({ detail: { editor } }) {
        wrapText(editor, "*");
      },
    },
    {
      type: "single",
      title: locale.quote,
      icon: icons.quote,
      cheatsheet: `> ${locale.quotedText}`,
      click({ detail: { editor } }) {
        replaceLines(editor, (line) => "> " + line);
      },
    },
    {
      type: "single",
      title: locale.link,
      icon: icons.link,
      cheatsheet: `[${locale.linkText}](url)`,
      shortcut: getShortcutWithPrefix("K"),
      click({ detail: { editor } }) {
        wrapText(editor, "[", "](url)");
      },
    },
    {
      type: "single",
      title: locale.image,
      icon: icons.image,
      cheatsheet: `![${locale.imageAlt}](url "${locale.imageTitle}")`,
      shortcut: getShortcutWithPrefix("I", true),
      async click(ctx) {
        const fileList = await selectFiles({
          accept: "image/*",
          multiple: true,
        });

        if (fileList?.length) {
          // await handleImageUpload(
          //   ctx,
          //   uploadImages!, // FIXME:
          //   Array.from(fileList),
          // );
        }
      },
    },
    {
      type: "single",
      title: locale.code,
      icon: icons.code,
      cheatsheet: "`" + locale.codeText + "`",
      shortcut: getShortcutWithPrefix("K", true),
      click({ detail: { editor } }) {
        wrapText(editor, "`");
      },
    },
    {
      type: "single",
      title: locale.codeBlock,
      icon: icons.codeBlock,
      cheatsheet: "```" + locale.codeLang + "↵",
      shortcut: getShortcutWithPrefix("C", true),
      click({ detail: { editor } }) {
        appendBlock(editor, "lang", { prefix: "```", suffix: "\n```\n" });
      },
    },
    {
      type: "single",
      title: locale.ul,
      icon: icons.ul,
      cheatsheet: `- ${locale.ulItem}`,
      shortcut: getShortcutWithPrefix("U", true),
      click({ detail: { editor } }) {
        replaceLines(editor, (line) => "- " + line);
      },
    },
    {
      type: "single",
      title: locale.ol,
      icon: icons.ol,
      cheatsheet: `1. ${locale.olItem}`,
      shortcut: getShortcutWithPrefix("O", true),
      click({ detail: { editor } }) {
        replaceLines(editor, (line, i) => `${i + 1}. ${line}`);
      },
    },
  ];
}

if (import.meta.vitest) {
  const { test, expect, beforeEach, describe } = import.meta.vitest;
  let cm: EditorView;

  beforeEach(async () => {
    cm = new EditorView();
    return async () => {
      cm.destroy();
    };
  });

  describe("wrap text", () => {
    test("with selection", () => {
      cm.dispatch({ changes: { from: 0, insert: "text" } });
      cm.dispatch({ selection: { anchor: 1, head: 3 } });

      wrapText(cm, "[", "](url)");
      expect(cm.state).matchSnapshot();
      wrapText(cm, "[", "](url)");
      expect(cm.state).matchSnapshot();
    });

    test("find word", () => {
      cm.dispatch({ changes: { from: 0, insert: "text" } });

      wrapText(cm, "[", "](url)");
      expect(cm.state).matchSnapshot();
      wrapText(cm, "[", "](url)");
      expect(cm.state).matchSnapshot();
    });

    test("no word", () => {
      wrapText(cm, "[", "](url)");
      expect(cm.state).matchSnapshot();
      wrapText(cm, "[", "](url)");
      expect(cm.state).matchSnapshot();
    });

    test("with same prefix and suffix", () => {
      cm.dispatch({ changes: { from: 0, insert: "text" } });

      wrapText(cm, "*");
      expect(cm.state).matchSnapshot();
      wrapText(cm, "*");
      expect(cm.state).matchSnapshot();
    });
  });

  describe("replace lines", () => {
    test("basic", () => {
      cm.dispatch({ changes: { from: 0, insert: "line1\nline2" } });

      replaceLines(cm, (line) => "> " + line);
      expect(cm.state).matchSnapshot();
    });

    test("with selection", () => {
      cm.dispatch({ changes: { from: 0, insert: "line1\nline2" } });
      cm.dispatch({ selection: { anchor: 2, head: 8 } });

      replaceLines(cm, (line) => "> " + line);
      expect(cm.state).matchSnapshot();
    });
  });

  describe("append block", () => {
    test("basic", () => {
      cm.dispatch({ changes: { from: 0, insert: "text" } });

      appendBlock(cm, "block");
      expect(cm.state).matchSnapshot();
    });

    test("with prefix and suffix", () => {
      cm.dispatch({ changes: { from: 0, insert: "text" } });

      appendBlock(cm, "let x = 1", { prefix: "```js\n", suffix: "\n```" });
      expect(cm.state).matchSnapshot();
    });
  });
}
