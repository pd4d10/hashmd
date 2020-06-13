import path from 'path';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import css from 'rollup-plugin-css-only';
import { terser } from 'rollup-plugin-terser';
// import visualizer from 'rollup-plugin-visualizer';

const production = !process.env.ROLLUP_WATCH;

/** @type {Record<string, import('rollup').RollupOptions>} */
const packageConfigs = {
  bytemd: {},
  'bytemd/react': {
    external: ['react'],
  },
  'plugin-highlight': {},
  'plugin-math': {},
  'plugin-mermaid': {},
};

/** @type {import('rollup').Plugin} */
const commonPlugins = [
  commonjs(),
  svelte({
    dev: !production,
  }),
  resolve({
    browser: true,
    dedupe: ['svelte'],
  }),
  globals(),
  builtins(),
  json(),
  css({
    output: 'packages/bytemd/dist/index.css',
  }),
];

Object.entries(packageConfigs).forEach(([key, config]) => {
  const pkg = require(`./packages/${key}/package.json`);
  if (!config.input) {
    config.input = path.resolve('packages', key, 'src/index.js');
  }
  if (!config.output) {
    config.output = [
      {
        format: 'es',
        file: path.resolve('packages', key, pkg.module),
      },
      {
        format: 'cjs',
        file: path.resolve('packages', key, pkg.main),
      },
    ];
  }
  config.output.forEach((output) => {
    output.sourcemap = true;
  });
  config.plugins = [...(config.plugins || []), ...commonPlugins];

  // Make svelte related packages external to avoid multiple copies
  // https://github.com/sveltejs/svelte/issues/3671
  if (!config.external) config.external = Object.keys(pkg.dependencies || {});
  config.external.push('bytemd', 'svelte', 'svelte/internal');

  return config;
});

export default Object.values(packageConfigs);
