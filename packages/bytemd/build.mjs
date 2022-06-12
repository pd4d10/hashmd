// @ts-check
import fs from 'fs-extra'
import path from 'path'
import { preprocess } from 'svelte/compiler'
import glob from 'fast-glob'
import { sveltePreprocessor } from './tsdv.config.mjs'
import { execaCommand } from 'execa'

//
;(async () => {
  await fs.emptyDir('svelte')

  console.log('build svelte files...')
  const files = await glob('src/*.svelte')
  for (let file of files) {
    const dest = file.replace('src/', 'svelte/')
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

  console.log('build js files...')
  await execaCommand('tsc --project tsconfig.svelte.json')

  console.log('processing style files (backward compatibility)...')
  await fs.move('dist/style.css', 'dist/index.css')
  await fs.copy('dist/index.css', 'dist/index.min.css')
})()
