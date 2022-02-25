// @ts-check
import fs from 'fs-extra'
import { defineConfig } from '@norm/cli'

export default defineConfig({
  plugins: [
    {
      name: 'copy-style-files',
      closeBundle() {
        console.log('copy style files for backward compatibility...')
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
