// @ts-check
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
// import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

const production = !process.env.ROLLUP_WATCH;

/** @type {import('rollup').OutputOptions} */
const outputConfig = {
  sourcemap: true,
  name: 'bytemd'
};

const corePkg = require('./packages/bytemd/package.json');

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        });
      }
    }
  };
}

/** @type {import('rollup').RollupOptions} */
const core = {
  input: 'packages/bytemd/src/index.js',
  output: [
    {
      ...outputConfig,
      format: 'es',
      file: 'packages/bytemd/' + corePkg.module
    },
    {
      ...outputConfig,
      format: 'cjs',
      file: 'packages/bytemd/' + corePkg.main
    },
    {
      ...outputConfig,
      format: 'umd',
      file: 'packages/bytemd/' + corePkg.unpkg
    }
  ],
  plugins: [
    svelte({ dev: !production }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    globals(),
    builtins(),
    json(),
    production && terser(),
    visualizer()
  ],
  watch: {
    clearScreen: false
  }
};

const reactPkg = require('./packages/react/package.json');

/** @type {import('rollup').RollupOptions} */
const react = {
  input: 'packages/react/src/index.js',
  external: ['bytemd', 'react'],
  output: [
    {
      sourcemap: true,
      format: 'es',
      file: 'packages/react/' + reactPkg.module
    },
    {
      sourcemap: true,
      format: 'cjs',
      file: 'packages/react/' + reactPkg.main
    }
  ],
  plugins: [production && terser()]
};

/** @type {import('rollup').RollupOptions} */
const example = {
  input: 'packages/example/src/main.js',
  output: [
    {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'packages/example/public/build/bundle.js'
    }
  ],
  plugins: [
    svelte({
      dev: !production,
      css: css => {
        css.write('packages/example/public/build/bundle.css');
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    globals(),
    builtins(),
    json(),
    !production && serve(),
    production && terser()
  ]
};

const pluginHighlightPkg = require('./packages/plugin-highlight/package.json');

/** @type {import('rollup').RollupOptions} */
const pluginHighlight = {
  input: 'packages/plugin-highlight/src/index.js',
  output: [
    {
      sourcemap: true,
      format: 'es',
      file: 'packages/plugin-highlight/' + pluginHighlightPkg.module
    },
    {
      sourcemap: true,
      format: 'cjs',
      file: 'packages/plugin-highlight/' + pluginHighlightPkg.main
    }
  ],
  plugins: [
    svelte({ dev: !production }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    production && terser()
  ]
};

const pluginKatexPkg = require('./packages/plugin-katex/package.json');

/** @type {import('rollup').RollupOptions} */
const pluginKatex = {
  input: 'packages/plugin-katex/src/index.js',
  output: [
    {
      sourcemap: true,
      format: 'es',
      file: 'packages/plugin-katex/' + pluginKatexPkg.module
    },
    {
      sourcemap: true,
      format: 'cjs',
      file: 'packages/plugin-katex/' + pluginKatexPkg.main
    }
  ],
  plugins: [
    svelte({ dev: !production }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    production && terser()
  ]
};

export default [core, react, example, pluginHighlight, pluginKatex];
