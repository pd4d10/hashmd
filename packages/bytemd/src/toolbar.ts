import type { BytemdToolbarItem, EditorProps } from './types';
import { icons } from './icons';

const builtinMap: Record<string, BytemdToolbarItem> = {
  h1: {
    tooltip: 'Heading-1',
    icon: icons.h1,
    onClick({ utils }) {
      utils.replaceLines((lines) => lines.map((line) => '# ' + line));
    },
  },
  h2: {
    tooltip: 'Heading-2',
    icon: icons.h2,
    onClick({ utils }) {
      utils.replaceLines((lines) => lines.map((line) => '## ' + line));
    },
  },
  h3: {
    tooltip: 'Heading-3',
    icon: icons.h3,
    onClick({ utils }) {
      utils.replaceLines((lines) => lines.map((line) => '### ' + line));
    },
  },
  bold: {
    tooltip: 'Bold',
    icon: icons.bold,
    onClick({ utils }) {
      utils.replaceText((text) => '**' + text + '**');
    },
  },
  italic: {
    tooltip: 'Italic',
    icon: icons.italic,
    onClick({ utils }) {
      utils.replaceText((text) => '_' + text + '_');
    },
  },
  quote: {
    tooltip: 'Blockquote',
    icon: icons.quote,
    onClick({ utils }) {
      utils.replaceLines((lines) => lines.map((line) => '> ' + line));
    },
  },
  link: {
    tooltip: 'Link',
    icon: icons.link,
    onClick({ editor }) {
      if (editor.somethingSelected()) {
        const text = editor.getSelection();
        editor.replaceSelection(`[${text}](url)`);
        const { line, ch } = editor.getCursor();
        editor.setSelection({ line, ch: ch - 4 }, { line, ch: ch - 1 });
      } else {
        editor.replaceRange('[](url)', editor.getCursor());
        const { line, ch } = editor.getCursor();
        editor.setCursor({ line, ch: ch - 6 });
      }
      editor.focus();
    },
  },
  code: {
    tooltip: 'Code',
    icon: icons.code,
    onClick({ utils }) {
      utils.replaceText((text) => '`' + text + '`');
    },
  },
  codeBlock: {
    tooltip: 'Code block',
    icon: icons.codeBlock,
    onClick({ utils }) {
      utils.replaceLines((lines) => ['```', ...lines, '```']);
    },
  },
  ol: {
    tooltip: 'Ordered list',
    icon: icons.ol,
    onClick({ utils }) {
      utils.replaceLines((lines) =>
        lines.map((line, i) => `${i + 1}. ${line}`)
      );
    },
  },
  ul: {
    tooltip: 'Unordered list',
    icon: icons.ul,
    onClick({ utils }) {
      utils.replaceLines((lines) => lines.map((line) => '- ' + line));
    },
  },
};

// TODO:
export function getItemMap(plugins: EditorProps['plugins']) {
  const map = { ...builtinMap };
  plugins?.forEach((p) => {
    Object.assign(map, p.toolbar);
  });
  return map;
}
