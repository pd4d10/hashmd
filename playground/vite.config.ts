import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

const sveltePreprocessor = sveltePreprocess({
  typescript: true,
  // // https://github.com/sveltejs/svelte/issues/189#issuecomment-586142198
  // replace: [
  //   [/(>)[\s]*([<{])/g, '$1$2'],
  //   [/({[/:][a-z]+})[\s]*([<{])/g, '$1$2'],
  //   [/({[#:][a-z]+ .+?})[\s]*([<{])/g, '$1$2'],
  //   [/([>}])[\s]+(<|{[/#:][a-z][^}]*})/g, '$1$2'],
  // ],
})

export default defineConfig({
  base: '/playground/',
  plugins: [
    svelte({
      preprocess: [sveltePreprocessor],
    }),
  ],
})
