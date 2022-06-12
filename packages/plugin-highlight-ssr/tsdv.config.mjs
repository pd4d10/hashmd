// @ts-check
import { defineConfig } from 'tsdv'

export default defineConfig({
  target: 'es2019',
  tsc: false,
  plugins: [
    {
      name: 'config',
      config(c) {
        return {
          ...c,
          resolve: {
            alias: {
              lowlight: 'lowlight/lib/common', // https://github.com/rollup/plugins/issues/1159
            },
          },
        }
      },
    },
  ],
})
