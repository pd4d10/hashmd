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
  },
  plugins: [
    svelte({
      preprocess: [sveltePreprocessor],
    }),
  ],
})
