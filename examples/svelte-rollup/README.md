# svelte-rollup

With some tweaks based upon [svelte-rollup-template](https://github.com/sveltejs/template):

1. Set `output.inlineDynamicImports` to true
2. Replace `rollup-plugin-css-only` with `rollup-plugin-postcss` to import CSS files correctly
3. Add `@rollup/plugin-json` for JSON file imports
4. Add `@rollup/plugin-replace` for `process.env.NODE_ENV` value

For more details, see [rollup.config.js](./rollup.config.js)
