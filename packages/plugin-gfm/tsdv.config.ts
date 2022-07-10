import { defineConfig } from 'tsdv'
import { getAlias } from '../../scripts/build.mjs'

export default defineConfig({
  target: 'es2019',
  tsc: false,
  vite({ format }) {
    return {
      resolve: {
        alias: getAlias(format),
      },
    }
  },
})
