// @ts-check
import sveltePreprocess from 'svelte-preprocess'
import resolve from 'resolve'

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

const pkgName = 'decode-named-character-reference'

export const alias = {
  // do not resolve `browser` field to make it work at SSR
  // https://github.com/vitejs/vite/issues/4405
  [pkgName]: resolve.sync(pkgName),
}
