// @ts-check
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

// https://stackoverflow.com/a/50052194
export const rootDir = path.resolve(fileURLToPath(import.meta.url), '../..')

export const packagesDir = path.join(rootDir, 'packages')
export const packages = fs.readdirSync(packagesDir)
