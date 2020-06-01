import path from 'path';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import { string } from 'rollup-plugin-string';
import json from '@rollup/plugin-json';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';

const production = !process.env.ROLLUP_WATCH;

/** @type {import('rollup').RollupOptions} */
const config = {
  input: path.resolve(__dirname, 'packages/example/src/index.js'),
  output: [
    {
      file: 'packages/example/public/build/bundle.js',
      format: 'iife', // immediately-invoked function expression — suitable for <script> tags
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    css(),
    builtins(),
    globals(),
    json(),
    string({ include: ['**/*.md'] }),
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
    production && terser(), // minify, but only in production
  ],
};

export default config;
