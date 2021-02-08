const locale = {
  inline: {
    title: 'Math formula',
    cheatsheet: '$\\TeX$',
  },
  display: {
    title: 'Math formula block',
    cheatsheet: '$$↵\\TeX↵$$',
  },
};

export default locale;

export type Locale = typeof locale;
