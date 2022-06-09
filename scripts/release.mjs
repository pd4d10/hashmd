// @ts-check
import fs from 'fs-extra'
import { execaCommandSync, execaSync } from 'execa'
import { packages, packagesDir } from './utils.mjs'
import path from 'path'

const version = process.argv[2]
if (!version) {
  throw new Error('version invalid')
}

packages.forEach((p) => {
  const dir = path.join(packagesDir, p)

  const pkgPath = path.resolve(dir, 'package.json')
  const pkg = fs.readJsonSync(pkgPath)
  pkg.version = version
  fs.writeJsonSync(pkgPath, pkg)

  execaCommandSync(
    `conventional-changelog -p angular -i CHANGELOG.md -s --commit-path .`,
    { cwd: dir }
  )
})

execaCommandSync('pnpm format')
execaSync('git', ['add', '.'])
execaSync('git', ['commit', '-m', `release: v${version}`])
execaSync('git', ['tag', `v${version}`])
execaSync('git', ['push'])
execaSync('git', ['push', '--tags'])
