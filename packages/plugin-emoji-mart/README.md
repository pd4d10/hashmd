# @bytemd/plugin-emoji-mart

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-emoji-mart.svg)](https://npm.im/@bytemd/plugin-emoji-mart)

ByteMD plugin to support Emoji Mart

## Usage

```js
import { Editor } from 'bytemd'
import emojiMart from '@bytemd/plugin-emoji-mart'

new Editor({
  target: document.body,
  props: {
    plugins: [
      emojiMart(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
