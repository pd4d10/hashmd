# @bytemd/plugin-math-ssr

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-math-ssr.svg)](https://npm.im/@bytemd/plugin-math-ssr)

ByteMD plugin to support math formula (SSR compatible)

## Usage

```js
import { Editor } from 'bytemd'
import math from '@bytemd/plugin-math-ssr'

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
