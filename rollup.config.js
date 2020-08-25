import path from 'path';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
// import visualizer from 'rollup-plugin-visualizer';

const production = !process.env.ROLLUP_WATCH;
const umd = process.env.UMD; // TODO: dynamic import

/** @type {Record<string, import('rollup').RollupOptions>} */
const packageConfigs = {
  bytemd: {
    external: [
      'codemirror/mode/markdown/markdown.js',
      'codemirror/addon/display/placeholder.js',
      'hast-util-sanitize/lib/github.json',
    ],
  },
  'bytemd/react': {},
  'bytemd/vue': {},
  'plugin-breaks': {},
  'plugin-highlight': {},
  'plugin-highlight-lazy': {},
  'plugin-math': {},
  'plugin-math-lazy': {},
  'plugin-mermaid': {},
  'plugin-footnotes': {},
  'plugin-vega': {},
  'plugin-html2md': {},
  'plugin-image-handler': {},
  'plugin-scroll-sync': {},
  'plugin-medium-zoom': {},
};

if (umd) {
  delete packageConfigs['bytemd/react'];
  delete packageConfigs['bytemd/vue'];
}

Object.entries(packageConfigs).forEach(([key, config]) => {
  // config.inlineDynamicImports = true;
  const pkg = require(`./packages/${key}/package.json`);
  if (!config.input) {
    config.input = path.resolve('packages', key, 'src/index.js');
  }
  if (!config.output) {
    if (umd) {
      config.output = [
        {
          name: key,
          format: 'umd',
          file: path.resolve('packages', key, pkg.unpkg),
        },
      ];
    } else {
      config.output = [
        { format: 'es', file: path.resolve('packages', key, pkg.module) },
        { format: 'cjs', file: path.resolve('packages', key, pkg.main) },
      ];
    }
  }
  config.output.forEach((output) => {
    output.sourcemap = true;
  });
  config.plugins = [
    commonjs(),
    svelte({
      dev: !production,
    }),
    vue(),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    json(),
    umd && terser(),
  ];

  config.external = [
    'bytemd',
    ...(config.external || []),
    ...(umd ? [] : Object.keys(pkg.dependencies || {})),
  ];

  // config.watch = {
  //   clearScreen: false,
  // };
  return config;
});

/** @type {import('rollup').RollupOptions} */
const styleConfig = {
  input: 'packages/bytemd/styles/index.scss',
  output: {
    file: 'style.js', // We don't need this file
  },
  plugins: [
    postcss({
      extract: path.resolve(__dirname, 'packages/bytemd/dist/index.css'),
    }),
  ],
};

export default [styleConfig, ...Object.values(packageConfigs)];
