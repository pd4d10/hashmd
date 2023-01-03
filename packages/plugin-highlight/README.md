# @bytemd/plugin-highlight

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight.svg)](https://npm.im/@bytemd/plugin-highlight)

ByteMD plugin to highlight code blocks

## Usage

```js
import highlight from '@bytemd/plugin-highlight'
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
