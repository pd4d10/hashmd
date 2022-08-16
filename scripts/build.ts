import fs from 'fs-extra'
import path from 'path'
import { preprocess } from 'svelte/compiler'
import glob from 'fast-glob'
import { execaCommand } from 'execa'
import _ from 'lodash-es'
import { build } from 'tsdv'
import { emitDts } from 'svelte2tsx'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import resolve from 'resolve'
import { packages, packagesDir } from './utils'
import { createVuePlugin } from '../packages/vue/plugin'
import { createVue3Plugin } from '../packages/vue-next/plugin'

const sveltePreprocessor = sveltePreprocess({
  typescript: true,
  // https://github.com/sveltejs/svelte/issues/189#issuecomment-586142198
  replace: [
    [/(>)[\s]*([<{])/g, '$1$2'],
    [/({[/:][a-z]+})[\s]*([<{])/g, '$1$2'],
    [/({[#:][a-z]+ .+?})[\s]*([<{])/g, '$1$2'],
    [/([>}])[\s]+(<|{[/#:][a-z][^}]*})/g, '$1$2'],
  ],
})

;(async () => {
  for (let name of packages) {
    console.log('[building]', name)

    const root = path.resolve(packagesDir, name)
    process.chdir(root)

    if (name === 'bytemd') {
      // some parts are from here https://github.com/sveltejs/kit/blob/master/packages/kit/src/packaging/typescript.js
      await emitDts({
        svelteShimsPath: require.resolve('svelte2tsx/svelte-shims.d.ts'),
        declarationDir: './dist',
      })
    }

    await build({
      root,
      target: 'es2019', // nullish coalescing in es2020
      tsc: false,
      vite({ format }) {
        const alias = {
          // https://github.com/rollup/plugins/issues/1159
          // for plugin-highlight-ssr
          lowlight: 'lowlight/lib/common',
        }

        if (format === 'cjs') {
          const pkgName = 'decode-named-character-reference'

          // do not resolve `browser` field to make CJS bundle work at SSR
          // https://github.com/vitejs/vite/issues/4405
          // for bytemd and plugin-gfm
          alias[pkgName] = resolve.sync(pkgName)
        }

        return {
          resolve: { alias },
          plugins: [
            name === 'bytemd' &&
              svelte({
                preprocess: [sveltePreprocessor],
              }),
            name === 'vue' && createVuePlugin(),
            name === 'vue-next' && createVue3Plugin(),
          ],
        }
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'test/setup.ts',
      },
    })

    if (name === 'bytemd') {
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

      console.log('patch index js...')
      let js = await fs.readFile('svelte/index.js', 'utf8')
      js = js
        .split('\n')
        .filter((line) => !line.includes('index.scss'))
        .join('\n')
      await fs.writeFile('svelte/index.js', js)

      console.log('processing style files (backward compatibility)...')
      await fs.move('dist/style.css', 'dist/index.css')
      await fs.copy('dist/index.css', 'dist/index.min.css')
    }
  }
})()
