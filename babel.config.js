module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: { ie: 9 },
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { node: true },
          },
        ],
      ],
    },
  },
}
