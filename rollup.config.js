// @ts-check
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
// import visualizer from 'rollup-plugin-visualizer';

const production = !process.env.ROLLUP_WATCH;

const bundlePackages = process.env.BUNDLE_PACKAGES;

/** @type {Record<string, import('rollup').RollupOptions>} */
const packageConfigs = {
  bytemd: {
    input: 'src/index.js',
    external: [
      'codemirror',
      'codemirror/mode/markdown/markdown.js',
      'unified',
      'remark-parse',
      'remark-rehype',
      'rehype-raw',
      'tippy.js',
    ],
    watch: {
      clearScreen: false,
    },
  },
  'bytemd-react': {
    external: ['react'],
  },
  'plugin-highlight': {
    external: ['lowlight'],
  },
  'plugin-math': {
    external: ['katex', 'remark-math'],
  },
  'plugin-graphviz': {
    external: ['viz.js', 'viz.js/full.render.js'],
  },
  'plugin-mermaid': {
    external: ['mermaid'],
  },
  'plugin-twemoji': {
    external: ['twemoji'],
  },
  'plugin-media': {},
  'plugin-xgplayer': {
    external: ['xgplayer'],
  },
  'plugin-abc': {
    external: ['abcjs'],
  },
};

/** @type {Record<string, import('rollup').RollupOptions>} */
const exampleConfigs = {
  example: {
    input: 'src/main.js',
    output: [
      {
        format: 'iife',
        dir: 'public/build',
      },
    ],
  },
};

const bundledConfigs = bundlePackages ? packageConfigs : exampleConfigs;

Object.entries(bundledConfigs).forEach(([k, v]) => {
  if (!v.input) {
    v.input = 'src/index.js';
  }
  v.input = path.resolve('packages', k, v.input);
  if (!v.output) {
    const pkg = require(`./packages/${k}/package.json`);
    v.output = [
      {
        format: 'es',
        file: pkg.module,
      },
      {
        format: 'cjs',
        file: pkg.main,
      },
    ];
  }
  v.output.forEach(output => {
    if (output.file) {
      output.file = path.resolve('packages', k, output.file);
    }
    if (output.dir) {
      output.dir = path.resolve('packages', k, output.dir);
    }
    output.sourcemap = true;
  });
  v.plugins = [
    alias({
      entries: [
        {
          find: 'icons',
          replacement: path.resolve(__dirname, 'vendor/octicons-v2/icons/16'),
        },
      ],
    }),
    k === 'example' &&
      css({
        output: 'packages/example/public/build/library.css',
      }),
    svelte({
      dev: !production,
      preprocess: {
        // Remove spaces
        // https://github.com/UnwrittenFun/prettier-plugin-svelte/issues/24#issuecomment-495778976
        markup: input => ({
          code: input.content
            .replace(
              /(>|})\s+(?![^]*?<\/(?:script|style)>|[^<]*?>|[^{]*?})/g,
              '$1',
            )
            .replace(
              /(?<!<[^>]*?|{[^}]*?)\s+(<|{)(?![^]*<\/(?:script|style)>)/g,
              '$1',
            ),
        }),
      },
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    globals(),
    builtins(),
    json(),
    string({ include: ['**/*.svg', '**/*.md'] }),
    production && k === 'example' && terser(), // For UMD
    // k === 'example' && visualizer(),
  ];

  if (!v.external) v.external = [];
  if (k !== 'example') {
    // Make svelte related packages external to avoid multiple copies
    // https://github.com/sveltejs/svelte/issues/3671
    v.external.push('svelte', 'svelte/internal');
    if (k !== 'bytemd') {
      v.external.push('bytemd', 'bytemd/helpers');
    }
  }

  return v;
});

export default Object.values(bundledConfigs);
