// @ts-check
import fs from 'fs-extra'
import path from 'path'
import { defineConfig } from '@norm/cli'
import { preprocess } from 'svelte/compiler'
import { sveltePreprocessor } from '../../norm.config.mjs'
import glob from 'fast-glob'

export default defineConfig({
  plugins: [
    {
      name: 'process-svelte-files',
      async closeBundle() {
        console.log('building helpers js...')

        const files = await glob('packages/bytemd/src/*.svelte')
        console.log('processing svelte files...', files)

        for (let file of files) {
          const dest = file.replace('/src/', '/lib/')
          await fs.ensureDir(path.dirname(dest))

          if (fs.statSync(file).isDirectory()) return

          if (file.endsWith('.svelte')) {
            const source = await fs.readFile(file, 'utf8')
            const item = await preprocess(source, sveltePreprocessor, {
              filename: file,
            })
            await fs.writeFile(
              dest,
              item.code.replace('<script lang="ts">', '<script>')
            )
          }
        }
      },
    },
  ],
})
