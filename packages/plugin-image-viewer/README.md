# @bytemd/plugin-image-viewer

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-image-viewer.svg)](https://npm.im/@bytemd/plugin-image-viewer)

ByteMD plugin to support image zoom and preview

## Usage

```js
import { Editor } from 'bytemd';
import imageViewer from '@bytemd/plugin-image-viewer';

new Editor({
  target: document.body,
  props: {
    plugins: [
      imageViewer(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
