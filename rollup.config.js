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
const reactPkg = require('./packages/bytemd-react/package.json');
const highlightPkg = require('./packages/plugin-highlight/package.json');
const mathPkg = require('./packages/plugin-math/package.json');
const graphvizPkg = require('./packages/plugin-graphviz/package.json');
const mermaidPkg = require('./packages/plugin-mermaid/package.json');

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
        format: 'es',
        file: corePkg.module
      },
      {
        format: 'cjs',
        file: corePkg.main
      },
      {
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
        format: 'es',
        file: reactPkg.module
      },
      {
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
        format: 'es',
        file: highlightPkg.module
      },
      {
        format: 'cjs',
        file: highlightPkg.main
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
  'plugin-math': {
    input: 'src/index.js',
    output: [
      {
        format: 'es',
        file: mathPkg.module
      },
      {
        format: 'cjs',
        file: mathPkg.main
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
  'plugin-graphviz': {
    input: 'src/index.js',
    output: [
      {
        format: 'es',
        file: graphvizPkg.module
      },
      {
        format: 'cjs',
        file: graphvizPkg.main
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
  'plugin-mermaid': {
    input: 'src/index.js',
    output: [
      {
        format: 'es',
        file: mermaidPkg.module
      },
      {
        format: 'cjs',
        file: mermaidPkg.main
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
    output.sourcemap = true;
  });
  return v;
});

export default Object.values(configs);
