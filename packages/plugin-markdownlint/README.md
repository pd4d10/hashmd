# @bytemd/plugin-markdownlint

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-markdownlint.svg)](https://npm.im/@bytemd/plugin-markdownlint)

ByteMD plugin to lint document with markdownlint

## Usage

```js
import { Editor } from 'bytemd';
import markdownlint from '@bytemd/plugin-markdownlint';

new Editor({
  target: document.body,
  props: {
    plugins: [
      markdownlint(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
