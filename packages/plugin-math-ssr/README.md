# @bytemd/plugin-math-ssr

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-math-ssr.svg)](https://npm.im/@bytemd/plugin-math-ssr)

ByteMD plugin to support math formula (SSR compatible)

## Usage

Import [katex](https://katex.org/) stylesheet: `katex/dist/katex.css`

```js
import math from '@bytemd/plugin-math-ssr'
import { Editor } from 'bytemd'

new Editor({
  target: document.body,
  props: {
    plugins: [
      math(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
