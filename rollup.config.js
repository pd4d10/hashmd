// @ts-check
import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import polyfills from 'rollup-plugin-node-polyfills';
// import visualizer from 'rollup-plugin-visualizer';

const production = !process.env.ROLLUP_WATCH;

const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));

const configs = packages
  .map((key) => {
    const pkg = fs.readJsonSync(`./packages/${key}/package.json`);

    /** @type {import('rollup').RollupOptions} */
    const commonConfig = {
      input: path.resolve('packages', key, 'lib/index.js'),
      plugins: [
        commonjs(),
        svelte({}),
        vue(),
        resolve({
          browser: true,
          dedupe: ['svelte'],
        }),
        json(),
        polyfills(),
      ],
    };

    /** @type {import('rollup').RollupOptions} */
    const config = {
      ...commonConfig,
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
      watch: {
        clearScreen: false,
      },
    };

    /** @type {import('rollup').RollupOptions} */
    const umdConfig = {
      ...commonConfig,
      output: {
        format: 'umd',
        name: key.startsWith('plugin-')
          ? _.camelCase(`bytemd-${key.replace(/-ssr$/, '')}`)
          : 'bytemd',
        sourcemap: true,
        inlineDynamicImports: true,
        file: path.resolve('packages', key, pkg.unpkg),
        plugins: [terser()],
      },
      external: Object.keys(pkg.peerDependencies || {}),
    };

    if (production) {
      return [config, umdConfig];
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
