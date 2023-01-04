// @ts-check
import fs from 'fs-extra'
import path from 'path'
import sveltePreprocess from 'svelte-preprocess'
import { fileURLToPath } from 'url'

// https://stackoverflow.com/a/50052194
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const rootDir = path.resolve(__dirname, '..')

export const packagesDir = path.join(rootDir, 'packages')
export const packages = fs.readdirSync(packagesDir)

export const sveltePreprocessor = sveltePreprocess({
  typescript: true,
  // https://github.com/sveltejs/svelte/issues/189#issuecomment-586142198
  replace: [
    [/(>)[\s]*([<{])/g, '$1$2'],
    [/({[/:][a-z]+})[\s]*([<{])/g, '$1$2'],
    [/({[#:][a-z]+ .+?})[\s]*([<{])/g, '$1$2'],
    [/([>}])[\s]+(<|{[/#:][a-z][^}]*})/g, '$1$2'],
  ],
})
