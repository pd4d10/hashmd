import { defineConfig } from 'tsdv'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { getAlias, sveltePreprocessor } from '../../scripts/build.mjs'

// nullish coalescing in es2020
export default defineConfig({
  target: 'es2019',
  tsc: false,
  vite({ format }) {
    return {
      resolve: {
        alias: getAlias(format),
      },
      plugins: [
        svelte({
          preprocess: [sveltePreprocessor],
        }),
      ],
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test/setup.ts',
  },
})
