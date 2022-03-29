# @bytemd/plugin-medium-zoom

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-medium-zoom.svg)](https://npm.im/@bytemd/plugin-medium-zoom)

ByteMD plugin to zoom images like Medium

## Usage

```js
import { Editor } from 'bytemd'
import mediumZoom from '@bytemd/plugin-medium-zoom'

new Editor({
  target: document.body,
  props: {
    plugins: [
      mediumZoom(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
