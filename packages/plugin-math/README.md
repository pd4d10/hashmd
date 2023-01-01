# @bytemd/plugin-math

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-math.svg)](https://npm.im/@bytemd/plugin-math)

ByteMD plugin to support math formula

## Usage

Import [katex](https://katex.org/) stylesheet: `katex/dist/katex.css`

```js
import math from '@bytemd/plugin-math'
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
