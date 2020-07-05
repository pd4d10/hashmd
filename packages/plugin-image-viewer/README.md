# @bytemd/plugin-image-viewer

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-image-viewer.svg)](https://npm.im/@bytemd/plugin-image-viewer)

[bytemd](https://github.com/bytedance/bytemd) plugin to support image preview

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
