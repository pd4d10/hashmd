import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
      hot: false,
    }),
  ],
  test: {
    include: ['packages/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: 'test-setup.ts',
  },
})
