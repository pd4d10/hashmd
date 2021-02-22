const locale = {
  formula: 'Formula',
  inline: {
    title: 'Inline formula',
    cheatsheet: '$\\TeX$',
  },
  block: {
    title: 'Block formula',
    cheatsheet: '$$↵\\TeX↵$$',
  },
};

export default locale;

export type Locale = typeof locale;
