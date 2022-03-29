// @ts-check
import fs from 'fs-extra'
import path from 'path'
import { defineConfig, defineProjectConfig, vite } from '@norm/cli'
import { preprocess } from 'svelte/compiler'
import glob from 'fast-glob'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { createVuePlugin } from 'vite-plugin-vue2'
import vue from '@vitejs/plugin-vue'
import { resolveModule } from 'local-pkg'

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

const pkgName = 'decode-named-character-reference'
const resolveOptions = {
  alias: {
    // do not resolve `browser` field to make it work at SSR
    // https://github.com/vitejs/vite/issues/4405
    [pkgName]: resolveModule(pkgName),
  },
}

const libraryConfig = defineProjectConfig({
  type: 'library',
  exports: {
    '.': './src/index.ts',
  },
  overrides: {
    build: {
      target: 'es2019', // nullish coalescing in es2020
    },
    resolve: resolveOptions,
  },
})

export default defineConfig({
  projects: {
    'packages/bytemd': {
      ...libraryConfig,
      overrides: {
        ...libraryConfig.overrides,
        plugins: [
          svelte({
            preprocess: [sveltePreprocessor],
          }),
          {
            name: 'process-svelte-files',
            async closeBundle() {
              console.log('building svelte entry and helpers...')
              for (const [src, dest] of Object.entries({
                'src/helpers.ts': 'helpers.js',
                'src/index.ts': 'svelte-entry.js',
              })) {
                await vite.build({
                  root: 'packages/bytemd',
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
                  resolve: resolveOptions,
                })
              }

              console.log('processing svelte files...')
              const files = await glob('packages/bytemd/src/*.svelte')
              for (let file of files) {
                const dest = file.replace('/src/', '/dist/')
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
              await fs.move(
                'packages/bytemd/dist/style.css',
                'packages/bytemd/dist/index.css'
              )
              await fs.copy(
                'packages/bytemd/dist/index.css',
                'packages/bytemd/dist/index.min.css'
              )
            },
          },
        ],
      },
    },
    'packages/plugin-breaks': libraryConfig,
    'packages/plugin-frontmatter': libraryConfig,
    'packages/plugin-gemoji': libraryConfig,
    'packages/plugin-gfm': libraryConfig,
    'packages/plugin-highlight': {
      ...libraryConfig,
      overrides: {
        build: {
          rollupOptions: {
            output: {
              globals: {
                'highlight.js': 'hljs',
              },
            },
          },
        },
      },
    },
    'packages/plugin-highlight-ssr': {
      ...libraryConfig,
      overrides: {
        build: {
          rollupOptions: {
            output: {
              globals: {
                'highlight.js/lib/core': 'hljs',
              },
            },
          },
        },
      },
    },
    'packages/plugin-math': libraryConfig,
    'packages/plugin-math-ssr': libraryConfig,
    'packages/plugin-medium-zoom': libraryConfig,
    'packages/plugin-mermaid': libraryConfig,
    'packages/react': libraryConfig,
    'packages/vue': {
      ...libraryConfig,
      overrides: {
        ...libraryConfig.overrides,
        plugins: [createVuePlugin()],
      },
    },
    'packages/vue-next': {
      ...libraryConfig,
      overrides: {
        ...libraryConfig.overrides,
        plugins: [vue()],
      },
    },
    'packages/playground': {
      type: 'web-app',
      overrides: {
        plugins: [
          svelte({
            preprocess: [sveltePreprocessor],
          }),
        ],
      },
    },
  },
})
