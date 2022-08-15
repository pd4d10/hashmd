import fs from 'fs-extra'
import path from 'path'

// https://stackoverflow.com/a/50052194
export const rootDir = path.resolve(__dirname, '..')

export const packagesDir = path.join(rootDir, 'packages')
export const packages = fs.readdirSync(packagesDir)
