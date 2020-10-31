// @ts-check
import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import polyfills from 'rollup-plugin-node-polyfills';
// import visualizer from 'rollup-plugin-visualizer';

const production = !process.env.ROLLUP_WATCH;

const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));

/** @type {import('rollup').Plugin[]} */
const commonPlugins = [
  commonjs(),
  svelte({}),
  vue(),
  resolve({
    browser: true,
    dedupe: ['svelte'],
  }),
  json(),
  polyfills(),
];

const configs = packages
  .map((key) => {
    const pkg = fs.readJsonSync(`./packages/${key}/package.json`);
    const inputFile = path.resolve('packages', key, 'lib/index.js');
    const umdName = key.startsWith('plugin-')
      ? _.camelCase(`bytemd-${key.replace(/-ssr$/, '')}`)
      : 'bytemd';

    /** @type {import('rollup').RollupOptions} */
    const config = {
      input: inputFile,
      output: [
        {
          format: 'es',
          sourcemap: true,
          file: path.resolve('packages', key, pkg.module),
        },
        {
          format: 'cjs',
          sourcemap: true,
          file: path.resolve('packages', key, pkg.main),
        },
      ],
      external: [
        'codemirror/mode/gfm/gfm',
        'codemirror/mode/yaml-frontmatter/yaml-frontmatter',
        'codemirror/addon/display/placeholder',
        'hast-util-sanitize/lib/github.json',
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ],
      plugins: commonPlugins,
      watch: {
        clearScreen: false,
      },
    };

    /** @type {import('rollup').RollupOptions} */
    const minConfig = {
      input: inputFile,
      output: {
        format: 'umd',
        name: umdName,
        sourcemap: true,
        inlineDynamicImports: true,
        file: path.resolve('packages', key, pkg.unpkg),
        plugins: [terser()],
      },
      plugins: commonPlugins,
      external: Object.keys(pkg.peerDependencies || {}),
    };

    /** @type {import('rollup').RollupOptions} */
    const es5Config = {
      input: path.resolve('packages', key, 'lib/index.js'),
      output: {
        format: 'umd',
        name: umdName,
        sourcemap: true,
        inlineDynamicImports: true,
        file: path.resolve('packages', key, 'dist/index.es5.js'),
      },
      plugins: [
        ...commonPlugins,
        babel({
          babelHelpers: 'runtime',
          extensions: ['.js', '.mjs', '.html', '.svelte'],
        }),
      ],
    };

    // return [es5Config];

    if (production) {
      return [config, minConfig, es5Config];
    } else {
      return [config];
    }
  })
  .flat();

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

export default [styleConfig, ...configs];
