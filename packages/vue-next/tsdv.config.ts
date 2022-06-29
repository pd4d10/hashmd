import { defineConfig } from 'tsdv'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  target: 'es2019',
  tsc: false,
  vite: {
    plugins: [vue()],
  },
})
