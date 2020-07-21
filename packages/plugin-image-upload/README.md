# @bytemd/plugin-image-upload

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-image-upload.svg)](https://npm.im/@bytemd/plugin-image-upload)

ByteMD plugin to support image upload by paste or "drag and drop"

## Usage

```js
import { Editor } from 'bytemd';
import imageUpload from '@bytemd/plugin-image-upload';

new Editor({
  target: document.body,
  props: {
    plugins: [
      imageUpload(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
