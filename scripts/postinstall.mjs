// @ts-check
import fs from 'fs-extra'
import path from 'path'
import mustache from 'mustache'
import _ from 'lodash'
import { rootDir } from './utils.mjs'
import { execSync } from 'child_process'

function readFileSyncSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8')
  } catch (err) {
    return ''
  }
}

const packagesDir = path.join(rootDir, 'packages')
const libs = fs
  .readdirSync(packagesDir)
  .filter((x) => !x.includes('playground') && !x.includes('common'))
const plugins = libs.filter((x) => x.startsWith('plugin-'))

libs.forEach((p) => {
  // tsconfig
  fs.writeJsonSync(path.join(packagesDir, p, 'tsconfig.json'), {
    extends: '../../tsconfig-base.json',
    include: [
      'src',
      'locales/*.json', // https://github.com/microsoft/TypeScript/issues/25636#issuecomment-627111031
    ],
  })

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
  pkg.main = './src/index.ts'

  // pkg.exports = {
  //   '.': './src/index.ts',
  //   './locales/*': './locales/*',

  //   // for compatible with old version
  //   './lib/locales/*': './locales/*',
  //   './dist/index.js': './dist/index.js',
  //   './dist/index.min.js': './dist/index.js',
  // }
  // if (pkg.name === 'bytemd') {
  //   pkg.exports['./dist/style.css'] = './dist/style.css'
  //   pkg.exports['./dist/index.css'] = './dist/style.css'
  //   pkg.exports['./dist/index.min.css'] = './dist/style.css'
  // }
  pkg.files = ['dist', 'lib', 'locales']
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
  /## Plugins\s+([\w\W])*?\s+##/,
  (match, p1, offset, string) => {
    const content = plugins
      .map((p) => {
        const pkg = fs.readJsonSync(path.join(packagesDir, p, 'package.json'))
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

fs.writeFileSync(path.join(rootDir, 'README.md'), readme)

// format
execSync('npm run lint:fix', { stdio: 'inherit' })
execSync('npx sort-package-json package.json packages/*/package.json', {
  stdio: 'inherit',
})
execSync('npx sort-json packages/*/locales/*.json', { stdio: 'inherit' })
