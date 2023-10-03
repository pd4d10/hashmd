// @ts-check
import { createVue3Plugin } from '../packages/vue-next/plugin.mjs'
import { createVuePlugin } from '../packages/vue/plugin.mjs'
import { packages, packagesDir } from './utils.mjs'
import fs from 'fs-extra'
import { camelCase } from 'lodash-es'
import path from 'path'
import resolve from 'resolve'
import { build } from 'vite'

;(async () => {
  for (let name of packages) {
    console.log('[building]', name)

    const root = path.resolve(packagesDir, name)
    process.chdir(root)

    // build js
    const pkg = await fs.readJson(path.resolve(root, 'package.json'))

    for (let format of ['es', 'cjs', 'umd']) {
      const legacy = format === 'umd' || format === 'iife'
      const externalDeps = []

      if (legacy) {
        externalDeps.push(...Object.keys({ ...pkg.peerDependencies }))
      } else if (format === 'es') {
        externalDeps.push(
          ...Object.keys({
            ...pkg.peerDependencies,
            ...pkg.dependencies,
          }),
        )
      } else if (format === 'cjs') {
        const deps = Object.keys({ ...pkg.dependencies })
          // exclude esm packages, bundle them to make it work for cjs
          .filter((dep) => {
            const pkgPath = path.resolve(
              root,
              'node_modules',
              dep,
              'package.json',
            )

            if (!fs.existsSync(pkgPath)) {
              throw new Error(`${dep} not exists, please install it`)
            }

            const { type: pkgType } = fs.readJsonSync(pkgPath)
            return pkgType !== 'module'
          })

        externalDeps.push(...Object.keys({ ...pkg.peerDependencies }), ...deps)
      }

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

      await build({
        root,
        build: {
          emptyOutDir: false,
          minify: legacy,
          target: 'es2019', // nullish coalescing in es2020
          lib: {
            entry: 'src/index.ts',
            name: camelCase(pkg.name),
            formats: [format],
            fileName: 'index',
          },
          rollupOptions: {
            external: [
              ...externalDeps,
              ...externalDeps.map((dep) => new RegExp(`^${dep}\/`)),
            ],
          },
        },
        resolve: { alias },
        plugins: [
          name === 'vue' && createVuePlugin(),
          name === 'vue-next' && createVue3Plugin(),
        ],
      })
    }
  }
})()
