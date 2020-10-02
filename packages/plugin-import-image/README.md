# @bytemd/plugin-import-image

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-import-image.svg)](https://npm.im/@bytemd/plugin-import-image)

ByteMD plugin to import image by pasting or dropping

## Usage

```js
import { Editor } from 'bytemd';
import importImage from '@bytemd/plugin-import-image';

new Editor({
  target: document.body,
  props: {
    plugins: [
      importImage(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
