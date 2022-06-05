// @ts-check
import { defineConfig } from 'tsdv'

import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  target: 'es2019',
  tsc: false,
  plugins: [createVuePlugin()],
})
