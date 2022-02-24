// @ts-check
import fs from 'fs-extra'
import { defineConfig } from '@norm/cli'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
    // {
    //   name: 'copy-style-files',
    //   closeBundle() {
    //     console.log('copy style files...')
    //     fs.copyFileSync(
    //       'packages/bytemd/dist/style.css',
    //       'packages/bytemd/dist/index.min.css'
    //     )
    //     fs.copyFileSync(
    //       'packages/bytemd/dist/style.css',
    //       'packages/bytemd/dist/index.css'
    //     )
    //   },
    // },
  ],
})
