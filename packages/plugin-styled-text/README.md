# @bytemd/plugin-styled-text

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-styled-text.svg)](https://npm.im/@bytemd/plugin-styled-text)

[bytemd](https://github.com/bytedance/bytemd) plugin to add styled text

## Usage

```js
import { Editor } from 'bytemd';
import styledText from '@bytemd/plugin-styled-text';

new Editor({
  target: document.body,
  props: {
    plugins: [
      styledText(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
