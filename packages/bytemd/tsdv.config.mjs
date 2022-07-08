// @ts-check
import { defineConfig } from 'tsdv'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { alias, sveltePreprocessor } from '../../scripts/build.mjs'

// nullish coalescing in es2020
export default defineConfig({
  target: 'es2019',
  tsc: false,
  vite: {
    resolve: { alias },
    plugins: [
      svelte({
        preprocess: [sveltePreprocessor],
      }),
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test/setup.ts',
  },
})
