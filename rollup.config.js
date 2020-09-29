// @ts-check
import fs from 'fs-extra';
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

const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));

/** @type {import('rollup').RollupOptions[]} */
const configs = packages.map((key) => {
  // config.inlineDynamicImports = true;
  const pkg = fs.readJsonSync(`./packages/${key}/package.json`);

  return {
    input: path.resolve('packages', key, 'lib/index.js'),
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
    plugins: [
      commonjs(),
      svelte({}),
      vue(),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      json(),
      umd && terser(),
    ],
    external: [
      'bytemd',
      'codemirror/mode/markdown/markdown.js',
      'codemirror/addon/display/placeholder.js',
      'hast-util-sanitize/lib/github.json',
      ...Object.keys(pkg.dependencies || {}),
    ],
    watch: {
      // clearScreen: false,
    },
  };
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

export default [styleConfig, ...configs];
