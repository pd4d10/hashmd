# @bytemd/plugin-breaks

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-breaks.svg)](https://npm.im/@bytemd/plugin-breaks)

ByteMD plugin to support breaks

## Usage

```js
import breaks from '@bytemd/plugin-breaks'
import { Editor } from 'bytemd'

new Editor({
  target: document.body,
  props: {
    plugins: [
      breaks(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
