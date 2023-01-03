# @bytemd/plugin-highlight-ssr

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight-ssr.svg)](https://npm.im/@bytemd/plugin-highlight-ssr)

ByteMD plugin to highlight code blocks (SSR compatible)

## Usage

```js
import highlight from '@bytemd/plugin-highlight-ssr'
import { Editor } from 'bytemd'
import 'highlight.js/styles/default.css'

new Editor({
  target: document.body,
  props: {
    plugins: [
      highlight(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
