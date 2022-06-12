// @ts-check
import { defineConfig } from 'tsdv'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

export const sveltePreprocessor = sveltePreprocess({
  typescript: true,
  // https://github.com/sveltejs/svelte/issues/189#issuecomment-586142198
  replace: [
    [/(>)[\s]*([<{])/g, '$1$2'],
    [/({[/:][a-z]+})[\s]*([<{])/g, '$1$2'],
    [/({[#:][a-z]+ .+?})[\s]*([<{])/g, '$1$2'],
    [/([>}])[\s]+(<|{[/#:][a-z][^}]*})/g, '$1$2'],
  ],
})

// nullish coalescing in es2020
// TODO: 'decode-named-character-reference'
export default defineConfig({
  target: 'es2019',
  tsc: false,
  plugins: [
    svelte({
      preprocess: [sveltePreprocessor],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test/setup.ts',
  },
})

// const pkgName = 'decode-named-character-reference'
// const resolveOptions = {
//   alias: {
//     // do not resolve `browser` field to make it work at SSR
//     // https://github.com/vitejs/vite/issues/4405
//     [pkgName]: resolve(pkgName),
//   },
// }
