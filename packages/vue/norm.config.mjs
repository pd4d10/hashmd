// @ts-check
import { defineConfig } from '@norm/cli'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  plugins: [createVuePlugin()],
})
