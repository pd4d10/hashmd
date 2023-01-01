# @bytemd/plugin-highlight

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight.svg)](https://npm.im/@bytemd/plugin-highlight)

ByteMD plugin to highlight code blocks

## Usage

Import [highlight.js](https://highlightjs.org/) stylesheet: `highlight.js/styles/default.css`

```js
import highlight from '@bytemd/plugin-highlight'
import { Editor } from 'bytemd'

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
