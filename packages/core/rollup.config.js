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

const pkg = require('./package.json');

export default {
  input: 'src/index.js',
  output: [
    {
      ...outputConfig,
      format: 'es',
      file: pkg.module
    },
    {
      ...outputConfig,
      format: 'cjs',
      file: pkg.main
    },
    {
      ...outputConfig,
      format: 'umd',
      file: 'public/build/bytemd.js'
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
