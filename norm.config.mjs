// @ts-check
import fs from 'fs-extra'
import path from 'path'
import {
  defineConfig,
  defineProjectConfig,
  mergeProjectConfig,
  vite,
} from '@norm/cli'
import { preprocess } from 'svelte/compiler'
import glob from 'fast-glob'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { createVuePlugin } from 'vite-plugin-vue2'
import vue from '@vitejs/plugin-vue'
import { resolveModule } from 'local-pkg'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// https://stackoverflow.com/a/50052194
export const rootDir = dirname(fileURLToPath(import.meta.url))

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
  preset: {
    type: 'library',
    exports: {
      '.': './src/index.ts',
    },
  },
  build: {
    target: 'es2019', // nullish coalescing in es2020
  },
  resolve: resolveOptions,
  test: {
    environment: 'jsdom',
    setupFiles: path.resolve(rootDir, 'scripts/test-setup.ts'),
  },
})

async function buildFilesForSvelte() {
  console.log('building svelte entry and helpers...')
  for (const [src, dest] of Object.entries({
    'src/helpers.ts': 'helpers.js',
    'src/index.ts': 'svelte-entry.js',
  })) {
    await vite.build({
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

export default defineConfig({
  projects: {
    'packages/bytemd': mergeProjectConfig(libraryConfig, {
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
    }),
    'packages/plugin-breaks': libraryConfig,
    'packages/plugin-frontmatter': libraryConfig,
    'packages/plugin-gemoji': libraryConfig,
    'packages/plugin-gfm': libraryConfig,
    'packages/plugin-highlight': mergeProjectConfig(libraryConfig, {
      build: {
        rollupOptions: {
          output: {
            globals: {
              'highlight.js': 'hljs',
            },
          },
        },
      },
    }),
    'packages/plugin-highlight-ssr': mergeProjectConfig(libraryConfig, {
      build: {
        rollupOptions: {
          output: {
            globals: {
              'highlight.js/lib/core': 'hljs',
            },
          },
        },
      },
      resolve: {
        alias: {
          lowlight: 'lowlight/lib/common', // FIXME: tree-shaking
        },
      },
    }),
    'packages/plugin-math': libraryConfig,
    'packages/plugin-math-ssr': libraryConfig,
    'packages/plugin-medium-zoom': libraryConfig,
    'packages/plugin-mermaid': libraryConfig,
    'packages/react': libraryConfig,
    'packages/vue': mergeProjectConfig(libraryConfig, {
      ...libraryConfig,
      plugins: [createVuePlugin()],
    }),
    'packages/vue-next': mergeProjectConfig(libraryConfig, {
      ...libraryConfig,
      plugins: [vue()],
    }),
    'packages/playground': {
      preset: {
        type: 'web-app',
      },
      base: '/playground/',
      plugins: [
        svelte({
          preprocess: [sveltePreprocessor],
        }),
      ],
    },
  },
})
