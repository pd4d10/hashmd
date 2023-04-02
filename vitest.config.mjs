// @ts-check
import { sveltePreprocessor } from './scripts/utils.mjs'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['packages/bytemd/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'packages/bytemd/test/setup.ts',
    alias: [
      { find: /^svelte$/, replacement: "svelte/internal" } // FIXME: https://github.com/vitest-dev/vitest/issues/2834
    ]
  },
  plugins: [
    svelte({
      preprocess: [sveltePreprocessor],
    }),
  ],
})
