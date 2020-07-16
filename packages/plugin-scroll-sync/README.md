# @bytemd/plugin-scroll-sync

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-scroll-sync.svg)](https://npm.im/@bytemd/plugin-scroll-sync)

[bytemd](https://github.com/bytedance/bytemd) plugin to sync scroll position of edit and preview area

## Usage

```js
import { Editor } from 'bytemd';
import scrollSync from '@bytemd/plugin-scroll-sync';

new Editor({
  target: document.body,
  props: {
    plugins: [
      scrollSync(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
