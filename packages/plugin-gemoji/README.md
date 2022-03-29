# @bytemd/plugin-gemoji

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-gemoji.svg)](https://npm.im/@bytemd/plugin-gemoji)

ByteMD plugin to support Gemoji shortcodes

## Usage

```js
import { Editor } from 'bytemd'
import gemoji from '@bytemd/plugin-gemoji'

new Editor({
  target: document.body,
  props: {
    plugins: [
      gemoji(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
