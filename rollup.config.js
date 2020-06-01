import path from 'path';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import css from 'rollup-plugin-css-only';
// import livereload from 'rollup-plugin-livereload';
import { string } from 'rollup-plugin-string';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
// import visualizer from 'rollup-plugin-visualizer';

const production = !process.env.ROLLUP_WATCH;

/** @type {Record<string, import('rollup').RollupOptions>} */
const packageConfigs = {
  bytemd: {},
  'bytemd/react': {
    input: path.resolve('packages/bytemd/react/src/index.tsx'),
    external: ['bytemd', 'react'],
  },
  'plugin-highlight': {},
  'plugin-math': {},
  'plugin-mermaid': {},
  'plugin-twemoji': {},
  'plugin-media': {},
  'plugin-xgplayer': {},
  'plugin-abc': {},
};

/** @type {import('rollup').Plugin} */
const commonPlugins = [
  typescript({ noEmitOnError: false }),
  commonjs(),
  alias({
    entries: [
      {
        find: 'icons',
        replacement: path.resolve(
          __dirname,
          'node_modules/@primer/octicons-v2/build/svg'
        ),
      },
    ],
  }),
  svelte({
    dev: !production,
    preprocess: {
      // Remove spaces
      // https://github.com/UnwrittenFun/prettier-plugin-svelte/issues/24#issuecomment-495778976
      markup: (input) => ({
        code: input.content
          .replace(
            /(>|})\s+(?![^]*?<\/(?:script|style)>|[^<]*?>|[^{]*?})/g,
            '$1'
          )
          .replace(
            /(?<!<[^>]*?|{[^}]*?)\s+(<|{)(?![^]*<\/(?:script|style)>)/g,
            '$1'
          ),
      }),
    },
  }),
  resolve({
    browser: true,
    dedupe: ['svelte'],
  }),
  globals(),
  builtins(),
  json(),
  string({ include: ['**/*.svg', '**/*.md'] }),
];

Object.entries(packageConfigs).forEach(([k, v]) => {
  const pkg = require(`./packages/${k}/package.json`);
  if (!v.input) {
    v.input = path.resolve('packages', k, 'src/index.ts');
  }
  if (!v.output) {
    v.output = [
      {
        format: 'es',
        file: path.resolve('packages', k, pkg.module),
      },
      {
        format: 'cjs',
        file: path.resolve('packages', k, pkg.main),
      },
    ];
  }
  v.output.forEach((output) => {
    output.sourcemap = true;
  });
  v.plugins = [...(v.plugins || []), ...commonPlugins];

  // Make svelte related packages external to avoid multiple copies
  // https://github.com/sveltejs/svelte/issues/3671
  if (!v.external) v.external = Object.keys(pkg.dependencies || {});
  v.external.push('svelte', 'svelte/internal', 'bytemd', 'bytemd/helpers');

  return v;
});

export default Object.values(packageConfigs);
