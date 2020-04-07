# @bytemd/plugin-twemoji

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-twemoji.svg)](https://npm.im/@bytemd/plugin-twemoji)

[bytemd](https://github.com/bytedance/bytemd) plugin to replace emoji characters with [twemoji](https://github.com/twitter/twemoji)

## Usage

```js
import { Editor } from 'bytemd';
import twemoji from '@bytemd/plugin-twemoji';

new Editor({
  target: document.body,
  props: {
    plugins: [
      twemoji(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
