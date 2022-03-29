// @ts-check
import path from 'path'
import { fileURLToPath } from 'url'

// https://stackoverflow.com/a/50052194
export const rootDir = path.resolve(fileURLToPath(import.meta.url), '../..')
