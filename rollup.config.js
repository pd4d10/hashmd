// @ts-check
import path from 'path';
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

const corePkg = require('./packages/bytemd/package.json');
const reactPkg = require('./packages/react/package.json');
const pluginHighlightPkg = require('./packages/plugin-highlight/package.json');
const pluginKatexPkg = require('./packages/plugin-katex/package.json');

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

/** @type {{ [key: string]: import('rollup').RollupOptions}} */
const configs = {
  bytemd: {
    input: 'src/index.js',
    output: [
      {
        sourcemap: true,
        format: 'es',
        file: corePkg.module
      },
      {
        sourcemap: true,
        format: 'cjs',
        file: corePkg.main
      },
      {
        sourcemap: true,
        format: 'umd',
        name: 'bytemd',
        file: corePkg.unpkg
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
  },
  'bytemd-react': {
    input: 'src/index.js',
    external: ['bytemd', 'react'],
    output: [
      {
        sourcemap: true,
        format: 'es',
        file: reactPkg.module
      },
      {
        sourcemap: true,
        format: 'cjs',
        file: reactPkg.main
      }
    ],
    plugins: [production && terser()]
  },
  example: {
    input: 'src/main.js',
    output: [
      {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js'
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
  },
  'plugin-highlight': {
    input: 'src/index.js',
    output: [
      {
        sourcemap: true,
        format: 'es',
        file: pluginHighlightPkg.module
      },
      {
        sourcemap: true,
        format: 'cjs',
        file: pluginHighlightPkg.main
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
  },
  'plugin-katex': {
    input: 'src/index.js',
    output: [
      {
        sourcemap: true,
        format: 'es',
        file: pluginKatexPkg.module
      },
      {
        sourcemap: true,
        format: 'cjs',
        file: pluginKatexPkg.main
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
  }
};

Object.entries(configs).forEach(([k, v]) => {
  v.input = path.resolve('packages', k, v.input);
  v.output.forEach(output => {
    output.file = path.resolve('packages', k, output.file);
  });
  return v;
});

export default Object.values(configs);
