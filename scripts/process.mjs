// @ts-check
import fs from 'fs-extra'
import path from 'path'
import glob from 'glob'
import chokidar from 'chokidar'
import { preprocess } from 'svelte/compiler'
import autoprocessor from 'svelte-preprocess'
import { rootDir } from './utils.mjs'

// svelte file: compile
// other files: copy
async function transform(file, dir = 'lib') {
  const dest = file.replace('/src/', `/${dir}/`)
  await fs.ensureDir(path.dirname(dest))

  if (fs.statSync(file).isDirectory()) return

  if (file.endsWith('.svelte')) {
    const source = await fs.readFile(file, 'utf8')
    const item = await preprocess(
      source,
      autoprocessor({
        typescript: {
          tsconfigFile: path.resolve(rootDir, 'tsconfig-base.json'),
        },
        // https://github.com/sveltejs/svelte/issues/189#issuecomment-586142198
        replace: [
          [/(>)[\s]*([<{])/g, '$1$2'],
          [/({[/:][a-z]+})[\s]*([<{])/g, '$1$2'],
          [/({[#:][a-z]+ .+?})[\s]*([<{])/g, '$1$2'],
          [/([>}])[\s]+(<|{[/#:][a-z][^}]*})/g, '$1$2'],
        ],
      }),
      {
        filename: file,
      }
    )
    await fs.writeFile(
      dest,
      item.code.replace('<script lang="ts">', '<script>')
    )
  } else {
    await fs.copyFile(file, dest)
  }
}

function watch(pattern, dest) {
  chokidar.watch(pattern).on('all', (event, file) => {
    console.log(event, file)
    transform(file, dest)
  })
}

function build(pattern, dir) {
  glob(pattern, (err, files) => {
    if (err) throw err

    for (let file of files) {
      transform(file, dir)
    }
  })
}

const pattern = path.resolve(
  rootDir,
  `packages/*/src/**/*.{svelte,vue,json,wxml,wxss}`
)
const mpPattern = path.resolve(
  rootDir,
  `packages/mp/src/**/*.{svelte,vue,json,wxml,wxss}`
)

if (process.argv.includes('--watch')) {
  watch(pattern)
  watch(mpPattern, 'dist')
} else {
  build(pattern)
  build(mpPattern, 'dist')
}
