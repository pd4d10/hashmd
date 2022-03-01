// @ts-check
import { defineConfig } from '@norm/cli'
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

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [sveltePreprocessor],
    }),
  ],
})
