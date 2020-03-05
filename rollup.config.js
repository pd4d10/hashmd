// @ts-check
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
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

const corePkg = require('./packages/core/package.json');

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
  input: 'packages/core/src/index.js',
  output: [
    {
      ...outputConfig,
      format: 'es',
      file: 'packages/core/' + corePkg.module
    },
    {
      ...outputConfig,
      format: 'cjs',
      file: 'packages/core/' + corePkg.main
    },
    {
      ...outputConfig,
      format: 'umd',
      file: 'packages/core/' + corePkg.unpkg
    }
  ],
  plugins: [
    svelte({ dev: !production }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
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
  external: ['react', '@bytemd/core'],
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
    builtins(),
    json(),
    !production && serve(),
    production && terser()
  ]
};

export default [core, react, example];
