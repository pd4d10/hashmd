import { defineConfig } from 'tsdv'
import { alias } from '../../scripts/build.mjs'

export default defineConfig({
  target: 'es2019',
  tsc: false,
  vite: {
    resolve: { alias },
  },
})
