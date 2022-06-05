// @ts-check
import { defineConfig } from 'tsdv'

// TODO: external, global name 'highlight.js/lib/core': 'hljs',
// TODO:  resolve lowlight: 'lowlight/lib/common', tree-shaking

export default defineConfig({
  target: 'es2019',
  tsc: false,
  minify: false,
})
