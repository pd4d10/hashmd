const locale = {
  strike: {
    title: 'Strikethrough',
    cheatsheet: '~~text~~',
  },
  task: {
    title: 'Task list',
    cheatsheet: '- [ ] todo',
  },
  table: {
    title: 'Table',
    heading: 'Heading',
  },
};

export default locale;

export type Locale = typeof locale;
