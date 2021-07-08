import fs from 'fs-extra'
import path from 'path'
import mustache from 'mustache'
import _ from 'lodash'

function readFileSyncSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8')
  } catch (err) {
    return ''
  }
}

const root = path.join(__dirname, '../packages')
const packages = fs.readdirSync(root)
const plugins = packages.filter(
  (x) => x.startsWith('plugin-') && !x.includes('-transform')
)

// tsconfig root
fs.writeJsonSync(
  path.resolve(__dirname, '../tsconfig.json'),
  {
    files: [],
    references: packages.map((p) => {
      return { path: 'packages/' + p }
    }),
  },
  { spaces: 2 }
)

packages.forEach((p) => {
  // tsconfig
  let tsconfig = {
    extends: '../../tsconfig-base.json',
    include: ['src', 'src/**/*.json'], // https://github.com/microsoft/TypeScript/issues/25636#issuecomment-627111031
    compilerOptions: {
      composite: true,
      rootDir: 'src',
      outDir: 'lib',
    },
  }
  if (p !== 'bytemd') {
    tsconfig.references = [{ path: '../bytemd' }]
  }

  fs.writeJsonSync(path.join(root, p, 'tsconfig.json'), tsconfig, {
    spaces: 2,
  })

  // license
  fs.copyFileSync(
    path.join(__dirname, '../LICENSE'),
    path.join(root, p, 'LICENSE')
  )

  // package.json
  const pkgPath = path.join(root, p, 'package.json')
  const pkg = require(pkgPath)
  pkg.repository = {
    type: 'git',
    url: 'https://github.com/bytedance/bytemd.git',
    directory: `packages/${p}`,
  }
  pkg.main = 'dist/index.cjs.js'
  pkg.module = 'dist/index.esm.js'
  pkg.types = 'lib/index.d.ts'
  pkg.unpkg = 'dist/index.min.js'
  pkg.jsdelivr = 'dist/index.min.js'
  pkg.files = ['dist', 'lib']
  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 })
})

// plugins readme
plugins.forEach((p) => {
  const name = p.split('-').slice(1).join('-')
  const result = mustache.render(
    readFileSyncSafe(path.join(__dirname, 'plugin-template.md')),
    {
      name,
      importedName: _.camelCase(name.replace('-ssr', '')),
      desc: require(path.join(root, p, 'package.json')).description,
    }
  )
  fs.writeFileSync(path.join(root, p, 'README.md'), result)
})

// bytemd readme
const readme = readFileSyncSafe(path.join(__dirname, '../README.md')).replace(
  /## Plugins\s+([\w\W])*?\s+##/,
  (match, p1, offset, string) => {
    const content = plugins
      .map((p) => {
        const pkg = require(path.join(root, p, 'package.json'))
        if (pkg.private) return

        const name = p.split('-').slice(1).join('-')
        const badge =
          `[![npm](https://img.shields.io/npm/v/@bytemd/plugin-${name}.svg)](https://npm.im/@bytemd/plugin-${name})` +
          ' ' +
          `[![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-${name}/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-${name})`
        const desc = _.upperFirst(
          pkg.description.replace('ByteMD plugin to ', '')
        )
        return `| [@bytemd/plugin-${name}](./packages/plugin-${name}) | ${badge} | ${desc} |`
      })
      .filter((x) => x)
      .join('\n')

    return `## Plugins

| Package | Status | Description |
| --- | --- | --- |
${content}

##`
  }
)

fs.writeFileSync(path.join(__dirname, '../README.md'), readme)

// locales
let importCode = ''
let exportObject = {}
packages.forEach((p) => {
  const localeDir = path.join(root, p, 'src/locales')
  if (fs.existsSync(localeDir) && fs.lstatSync(localeDir).isDirectory()) {
    const locales = fs.readdirSync(localeDir).map((x) => x.replace('.json', ''))
    const libName = p.startsWith('plugin') ? `@bytemd/${p}` : p

    locales.forEach((l) => {
      if (!exportObject[l]) exportObject[l] = {}

      const varName = _.snakeCase(l + '-' + p)

      importCode += `import ${varName} from '${libName}/lib/locales/${l}';\n`
      exportObject[l][_.snakeCase(p)] = varName
    })
  }
})
fs.writeFileSync(
  'examples/svelte/src/locales.js',
  importCode +
    'export default ' +
    JSON.stringify(exportObject, null, 2).replace(/"/g, '')
)
