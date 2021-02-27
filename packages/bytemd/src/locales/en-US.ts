const locale = {
  toolbar: {
    write: 'Write',
    preview: 'Preview',
    left: 'Write only',
    right: 'Preview only',
    help: 'Help',
    toc: 'Table of contents',
    fullscreen: 'Toggle fullscreen',
    source: 'Source code',
  },
  sidebar: {
    toc: 'Table of contents',
    cheatsheet: 'Markdown Cheat Sheet',
    shortcuts: 'Shortcuts',
  },
  status: {
    bytes: 'Bytes',
    lines: 'Lines',
    sync: 'Scroll sync',
    top: 'Scroll to top',
  },
  heading: {
    title: 'Heading',
    cheatsheet: '## heading',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    p: 'Paragraph',
  },
  bold: {
    title: 'Bold',
    cheatsheet: '**bold text**',
  },
  italic: {
    title: 'Italic',
    cheatsheet: '_italic text_',
  },
  quote: {
    title: 'Quote',
    cheatsheet: '> quote',
  },
  link: {
    title: 'Link',
    cheatsheet: '[text](url)',
  },
  image: {
    title: 'Image',
    cheatsheet: '![alt](url)',
  },
  code: {
    title: 'Code',
    cheatsheet: '`code`',
  },
  pre: {
    title: 'Code block',
    cheatsheet: '```lang',
  },
  ul: {
    title: 'Unordered list',
    cheatsheet: '- item 1',
  },
  ol: {
    title: 'Ordered list',
    cheatsheet: '1. item 1',
  },
  hr: {
    title: 'Horizontal rule',
    cheatsheet: '---',
  },
};

export default locale;

export type BytemdLocale = typeof locale;
