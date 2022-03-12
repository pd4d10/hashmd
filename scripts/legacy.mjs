// @ts-check
import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import { rootDir } from './utils.mjs'

const packagesDir = path.join(rootDir, 'packages')
const libs = fs
  .readdirSync(packagesDir)
  .filter((x) => !x.includes('playground') && !x.includes('common'))
// const plugins = libs.filter((x) => x.startsWith('plugin-'))

// copy files for backward compatibility...
libs.forEach((p) => {
  Object.entries({
    'dist/style.css': ['dist/index.css', 'dist/index.min.css'],
    'dist/index.umd.js': ['dist/index.js', 'dist/index.min.js'],
    locales: ['lib/locales'],
  }).forEach(([src, dests]) => {
    dests.forEach((dest) => {
      try {
        fs.copySync(
          path.join(packagesDir, p, src),
          path.join(packagesDir, p, dest)
        )
        console.log(p, 'coppied', src, 'to', dest)
      } catch (err) {}
    })
  })
})
