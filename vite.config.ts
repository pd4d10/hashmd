import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: 'test-setup.ts',
  },
})
