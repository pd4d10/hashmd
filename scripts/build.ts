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

// do not resolve `browser` field to make CJS bundle work at SSR
// https://github.com/vitejs/vite/issues/4405
export function getAlias(format) {
  const pkgName = 'decode-named-character-reference'

  if (format === 'cjs')
    return {
      [pkgName]: resolve.sync(pkgName),
    }
}
