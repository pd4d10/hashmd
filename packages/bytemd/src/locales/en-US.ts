const locale = {
  toolbar: {
    write: 'Write',
    preview: 'Preview',
    help: 'Help',
    toc: 'Table of contents',
    fullscreen: 'Toggle fullscreen',
    about: 'About',
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
