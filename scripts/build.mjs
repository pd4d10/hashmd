// @ts-check
import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import { build } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { createVuePlugin } from 'vite-plugin-vue2'
import sveltePreprocess from 'svelte-preprocess'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'

const packages = fs.readdirSync('./packages')

;(async () => {
  for (const key of packages) {
    if (key === 'bytemd' || key === 'plugin-highlight-ssr') continue

    const rootDir = path.resolve('./packages', key)
    const pkg = fs.readJsonSync(`./packages/${key}/package.json`)

    if (pkg.private) continue

    console.log('building js:', key)
    const umdName = key.startsWith('plugin-')
      ? _.camelCase(`bytemd-${key}`)
      : 'bytemd'
    const deps = _.uniq(
      Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })
    )

    /** @type {import('vite').UserConfig} */
    await build({
      root: rootDir,
      build: {
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
          external: [...deps, ...deps.map((dep) => new RegExp(`^${dep}\/`))],
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

    console.log('building dts:', key)
    /** @type {import('@microsoft/api-extractor').IConfigFile} */
    const aeConfig = {
      projectFolder: rootDir,
      mainEntryPointFilePath: path.resolve(rootDir, 'lib/index.d.ts'),
      apiReport: { enabled: false },
      docModel: { enabled: false },
      tsdocMetadata: { enabled: false },
      dtsRollup: {
        enabled: true,
        untrimmedFilePath: path.resolve(rootDir, 'dist/index.d.ts'),
      },
      bundledPackages: _.without(
        _.uniq([
          ...Object.keys({
            ...pkg.dependencie,
            ...pkg.peerDependencies,
            ...pkg.devDependencies,
          }),

          // TODO: whitelist
          'micromark-extension-gfm',
          'micromark-extension-gfm-strikethrough',
          'mdast-util-gfm-table',
          'mdast-util-gfm',
          'markdown-table',
          'highlight.js',
          'katex',
        ]),
        ...deps
      ), // TODO: imported from outside
    }

    const aeConfigFilePath = path.resolve(rootDir, 'api-extractor.json')
    await fs.writeJson(aeConfigFilePath, aeConfig)

    const extractorConfig = ExtractorConfig.loadFileAndPrepare(aeConfigFilePath)
    Extractor.invoke(extractorConfig)

    await fs.rm(aeConfigFilePath)
  }
})()
