# @bytemd/plugin-zip

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-zip.svg)](https://npm.im/@bytemd/plugin-zip)

ByteMD plugin to support Zip upload

## Usage

```js
import zip from '@bytemd/plugin-zip'
import { Editor } from 'bytemd'

new Editor({
  target: document.body,
  props: {
    plugins: [
      zip(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
