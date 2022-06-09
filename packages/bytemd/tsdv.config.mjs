// @ts-check
import fs from 'fs-extra'
import path from 'path'
import { preprocess } from 'svelte/compiler'
import glob from 'fast-glob'
import { build } from 'vite'
import { defineConfig } from 'tsdv'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

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

// nullish coalescing in es2020
// TODO: 'decode-named-character-reference'
export default defineConfig({
  target: 'es2019',
  tsc: false,
  plugins: [
    svelte({
      preprocess: [sveltePreprocessor],
    }),
    {
      name: 'process-svelte-files',
      async closeBundle() {
        if (process.env.VITEST) return

        await buildFilesForSvelte()
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test/setup.ts',
  },
})

// const pkgName = 'decode-named-character-reference'
// const resolveOptions = {
//   alias: {
//     // do not resolve `browser` field to make it work at SSR
//     // https://github.com/vitejs/vite/issues/4405
//     [pkgName]: resolve(pkgName),
//   },
// }

async function buildFilesForSvelte() {
  console.log('building svelte entry and helpers...')
  for (const [src, dest] of Object.entries({
    'src/helpers.ts': 'helpers.js',
    'src/index.ts': 'svelte-entry.js',
  })) {
    await build({
      build: {
        emptyOutDir: false,
        lib: {
          entry: src,
          formats: ['es'],
          fileName(format) {
            if (format === 'es') return dest
            throw new Error('should not be here')
          },
        },
        rollupOptions: {
          external: ['./helpers', /\.svelte$/],
        },
      },
      // resolve: resolveOptions,
    })
  }

  console.log('processing svelte files...')
  const files = await glob('src/*.svelte')
  for (let file of files) {
    const dest = file.replace('src/', 'dist/')
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

  console.log('processing style files (backward compatibility)...')
  await fs.move('dist/style.css', 'dist/index.css')
  await fs.copy('dist/index.css', 'dist/index.min.css')
}
