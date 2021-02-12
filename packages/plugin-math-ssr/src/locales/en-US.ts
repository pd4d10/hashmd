const locale = {
  inline: {
    title: 'Formula',
    cheatsheet: '$\\TeX$',
  },
  display: {
    title: 'Formula block',
    cheatsheet: '$$↵\\TeX↵$$',
  },
};

export default locale;

export type Locale = typeof locale;
