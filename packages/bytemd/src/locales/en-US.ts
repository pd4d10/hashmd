const locale = {
  toolbar: {
    write: 'Write',
    preview: 'Preview',
    help: 'Help',
    toc: 'Table of contents',
    fullscreen: 'Toggle fullscreen',
    about: 'About',
    heading: 'Heading',
    bold: 'Bold',
    italic: 'Italic',
    quote: 'Quote',
    link: 'Link',
    code: 'Code',
    codeBlock: 'Code block',
    ul: 'Unordered list',
    ol: 'Ordered list',
    hr: 'Horizontal rule',
  },
  help: {
    cheatsheet: 'Markdown Cheat Sheet',
    heading: '## heading',
    bold: '**bold text**',
    italic: '*italic text*',
    quote: '> quote',
    link: '[text](url)',
    code: '`code`',
    codeBlock: '```lang',
    ol: '1. item',
    ul: '* item',
    hr: '---',
  },
  toc: {
    title: 'Table of contents',
  },
  status: {
    bytes: 'Bytes',
    lines: 'Lines',
    sync: 'Scroll sync',
    top: 'Scroll to top',
  },
};

export default locale;

export type BytemdLocale = typeof locale;
