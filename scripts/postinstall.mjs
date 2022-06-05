// @ts-check
import fs from 'fs-extra'
import path from 'path'
import mustache from 'mustache'
import _ from 'lodash-es'
import { rootDir } from '../norm.config.mjs'
import { createRequire } from 'module'

function readFileSyncSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8')
  } catch (err) {
    return ''
  }
}

const packagesDir = path.join(rootDir, 'packages')
const packages = fs.readdirSync(packagesDir)
const plugins = packages.filter((x) => x.startsWith('plugin-'))

packages.forEach((p) => {
  const tsconfig = path.join(packagesDir, p, 'tsconfig.json')
  const c = fs.readJsonSync(tsconfig)
  c.include = ['src', 'src/locales/*.json'] //  https://github.com/microsoft/TypeScript/issues/25636#issuecomment-627111031
  c.compilerOptions = {
    rootDir: 'src',
    outDir: 'dist',
  }

  // tsconfig
  fs.writeJsonSync(tsconfig, c)
})

packages.forEach((p) => {
  // license
  fs.copyFileSync(
    path.join(rootDir, 'LICENSE'),
    path.join(packagesDir, p, 'LICENSE')
  )

  // package.json
  const pkgPath = path.join(packagesDir, p, 'package.json')
  const pkg = fs.readJsonSync(pkgPath)
  pkg.repository = {
    type: 'git',
    url: 'https://github.com/bytedance/bytemd.git',
    directory: `packages/${p}`,
  }

  pkg.types = './dist/index.d.ts'
  pkg.module = './dist/index.mjs'
  pkg.main = './dist/index.js'

  pkg.exports = {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.mjs',
      require: './dist/index.js',
    },
    './locales/*': './locales/*',

    // for compatible with old version
    './lib/locales/*': './locales/*',
  }
  pkg.files = ['dist', 'locales']

  if (pkg.name === 'bytemd') {
    pkg.exports['./dist/index.css'] = './dist/index.css'
    pkg.exports['./dist/index.min.css'] = './dist/index.min.css'
  }
  fs.writeJsonSync(pkgPath, pkg)
})

// plugins readme
plugins.forEach((p) => {
  const name = p.split('-').slice(1).join('-')
  const result = mustache.render(
    readFileSyncSafe(path.join(rootDir, 'scripts/plugin-template.md')),
    {
      name,
      importedName: _.camelCase(name.replace('-ssr', '')),
      desc: fs.readJsonSync(path.join(packagesDir, p, 'package.json'))
        .description,
    }
  )
  fs.writeFileSync(path.join(packagesDir, p, 'README.md'), result)
})

// bytemd readme
const readme = readFileSyncSafe(path.join(rootDir, 'README.md')).replace(
  /### Official Plugins\s+([\w\W])*?\s+##/,
  (match, p1, offset, string) => {
    const content = plugins
      .map((p) => {
        const pkg = fs.readJsonSync(path.join(packagesDir, p, 'package.json'))
        if (pkg.private) return

        const name = p.split('-').slice(1).join('-')
        const badge = `[![npm](https://img.shields.io/npm/v/@bytemd/plugin-${name}.svg?label=)](https://npm.im/@bytemd/plugin-${name})`
        const desc = _.upperFirst(
          pkg.description.replace('ByteMD plugin to ', '')
        )
        return `| [@bytemd/plugin-${name}](https://github.com/bytedance/bytemd/tree/main/packages/plugin-${name}) | ${badge} | ${desc} |`
      })
      .filter((x) => x)
      .join('\n')

    return `### Official Plugins

| Package | Status | Description |
| --- | --- | --- |
${content}

##`
  }
)

fs.writeFileSync(path.join(rootDir, 'README.md'), readme)

await (async () => {
  // create .svelte.ts files

  const bytemd_path = path.join(rootDir, 'packages/bytemd')
  const bytemd_src_path = path.join(bytemd_path, 'src')

  {
    // some parts are from here https://github.com/sveltejs/kit/blob/master/packages/kit/src/packaging/typescript.js
    // @ts-ignore
    const require = createRequire(import.meta.url)

    const emitDts = (await import('svelte2tsx')).emitDts

    await emitDts({
      libRoot: bytemd_src_path,
      svelteShimsPath: require.resolve('svelte2tsx/svelte-shims.d.ts'),
      declarationDir: './tmp',
    })

    const tmp_path = path.join(bytemd_path, './tmp')
    const files = fs.readdirSync(tmp_path)
    const file_end = '.svelte.d.ts'

    //copy svelte.d.ts to src, and change ending to svelte.ts
    files
      .filter((name) => name.endsWith(file_end))
      .map((name) => {
        fs.copyFileSync(
          path.join(tmp_path, name),
          path.join(
            bytemd_src_path,
            `${name.slice(0, name.length - file_end.length)}.svelte.ts`
          )
        )
      })

    fs.removeSync(tmp_path)
  }

  {
    //fix import conflict ViewerProps and EditorProps

    const fixes = {
      'viewer.svelte.ts': 'ViewerProps',
      'editor.svelte.ts': 'EditorProps',
    }

    Object.entries(fixes).map(([file_name, conflict]) => {
      const file_path = path.join(bytemd_src_path, file_name)
      const file = fs.readFileSync(file_path)
      const lines = file.toString().split('\n')
      const import_line = lines.findIndex(
        (line) =>
          line.startsWith('import type') && line.includes(` ${conflict} `)
      )
      const conflict_declaration_line = lines.findIndex((line) =>
        line.startsWith(`export declare type ${conflict} `)
      )

      if (import_line === -1 || conflict_declaration_line === -1) {
        throw new Error(
          `Could not find ${conflict} import or declaration, Is this Fix still needed?`
        )
      }

      const new_lines = lines.map((line, index) => {
        if (index === import_line) {
          return line.replace(` ${conflict} `, ` ${conflict} as ${conflict}2 `)
        }
        if (index <= import_line || index >= conflict_declaration_line) {
          return line
        }
        return line.replaceAll(conflict, `${conflict}2`)
      })

      fs.writeFileSync(file_path, new_lines.join('\n'))
    })
  }
})()
