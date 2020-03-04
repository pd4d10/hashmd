// @ts-check
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

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
      file: 'packages/core/' + 'public/build/bytemd.js'
    }
  ],
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production
      // we'll extract any component CSS out into
      // a separate file - better for performance
      // css: css => {
      //   css.write('public/build/bytemd.css');
      // }
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    builtins(),
    json(),
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};

const reactPkg = require('./packages/react/package.json');

/** @type {import('rollup').RollupOptions} */
const react = {
  input: 'packages/react/src/index.js',
  output: [
    {
      ...outputConfig,
      format: 'es',
      file: 'packages/react/' + reactPkg.module
    },
    {
      ...outputConfig,
      format: 'cjs',
      file: 'packages/react/' + reactPkg.main
    }
  ],
  plugins: [production && terser()]
};

export default [core, react];
