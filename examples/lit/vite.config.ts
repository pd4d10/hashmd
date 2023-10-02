import { defineConfig } from 'vite'
import workspace from 'vite-plugin-workspace'

export default defineConfig({
  plugins: [workspace()],
})
