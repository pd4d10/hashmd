# @bytemd/plugin-footnotes

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-footnotes.svg)](https://npm.im/@bytemd/plugin-footnotes)

ByteMD plugin to support footnotes

## Usage

```js
import { Editor } from 'bytemd'
import footnotes from '@bytemd/plugin-footnotes'

new Editor({
  target: document.body,
  props: {
    plugins: [
      footnotes(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
