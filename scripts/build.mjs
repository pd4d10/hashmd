// @ts-check
import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import { build } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { createVuePlugin } from 'vite-plugin-vue2'
import sveltePreprocess from 'svelte-preprocess'

const packages = fs.readdirSync('./packages')

const watch = process.argv[2] === '--watch'

const results = Promise.all(
  packages.map((key) => {
    const pkg = fs.readJsonSync(`./packages/${key}/package.json`)
    if (pkg.private) return []

    const umdName = key.startsWith('plugin-')
      ? _.camelCase(`bytemd-${key}`)
      : 'bytemd'

    /** @type {import('vite').UserConfig} */
    return build({
      root: path.resolve('./packages', key),
      build: {
        watch: watch ? {} : null,
        lib: {
          entry: 'src/index',
          name: umdName,
          formats: ['es', 'cjs', 'umd'],
          fileName(format) {
            if (format === 'es') return pkg.module.replace('dist/', '')
            if (format === 'cjs') return pkg.main.replace('dist/', '')
            if (format === 'umd') return pkg.unpkg.replace('dist/', '')
          },
        },
        rollupOptions: {
          external: [
            /^codemirror-ssr/,
            'hast-util-sanitize/lib/github.json',
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
          ],
        },
      },
      plugins: [
        svelte({
          preprocess: [sveltePreprocess({ typescript: true })],
        }),
        createVuePlugin(),
        key === 'bytemd' && {
          name: 'copy-style-files',
          closeBundle() {
            console.log('copy style files...')
            fs.copyFileSync(
              'packages/bytemd/dist/style.css',
              'packages/bytemd/dist/index.min.css'
            )
            fs.copyFileSync(
              'packages/bytemd/dist/style.css',
              'packages/bytemd/dist/index.css'
            )
          },
        },
      ],
    })
  })
)
