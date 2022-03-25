// @ts-check
import fs from 'fs-extra'
import path from 'path'
import { defineConfig, defineProjectConfig, vite } from '@norm/cli'
import { preprocess } from 'svelte/compiler'
import glob from 'fast-glob'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { createVuePlugin } from 'vite-plugin-vue2'

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

const libraryConfig = defineProjectConfig({
  type: 'library',
  exports: {
    '.': './src/index.ts',
  },
})

export default defineConfig({
  projects: {
    'packages/bytemd': {
      ...libraryConfig,
      overrides: {
        plugins: [
          svelte({
            preprocess: [sveltePreprocessor],
          }),
          {
            name: 'process-svelte-files',
            async closeBundle() {
              console.log('building helpers.js...')
              await vite.build({
                build: {
                  outDir: 'packages/bytemd/dist/svelte',
                  lib: {
                    entry: 'packages/bytemd/src/helpers.ts',
                    formats: ['es'],
                    fileName(format) {
                      if (format === 'es') return 'helpers.js'
                      throw new Error('should not be here')
                    },
                  },
                },
              })

              console.log('building index.js...')
              await vite.build({
                build: {
                  emptyOutDir: false,
                  outDir: 'packages/bytemd/dist/svelte',
                  lib: {
                    entry: 'packages/bytemd/src/index.ts',
                    formats: ['es'],
                    fileName(format) {
                      if (format === 'es') return 'index.js'
                      throw new Error('should not be here')
                    },
                  },
                  rollupOptions: {
                    external: ['./helpers', /\.svelte$/],
                  },
                },
              })

              const files = await glob('packages/bytemd/src/*.svelte')
              console.log(
                'processing svelte files...' //files
              )

              for (let file of files) {
                const dest = file.replace('/src/', '/dist/svelte/')
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
      },
    },
    'packages/plugin-breaks': libraryConfig,
    'packages/plugin-footnotes': libraryConfig,
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
        plugins: [createVuePlugin()],
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
