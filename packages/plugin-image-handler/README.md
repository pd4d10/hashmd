# @bytemd/plugin-image-handler

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-image-handler.svg)](https://npm.im/@bytemd/plugin-image-handler)

ByteMD plugin to handle image upload by paste or "drag and drop"

## Usage

```js
import { Editor } from 'bytemd';
import imageHandler from '@bytemd/plugin-image-handler';

new Editor({
  target: document.body,
  props: {
    plugins: [
      imageHandler(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
