// @ts-check
import { defineConfig } from '@norm/cli'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        globals: {
          'highlight.js/lib/core': 'hljs',
        },
      },
    },
  },
})
