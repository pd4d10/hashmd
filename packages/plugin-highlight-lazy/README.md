# @bytemd/plugin-highlight-lazy

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight-lazy.svg)](https://npm.im/@bytemd/plugin-highlight-lazy)

ByteMD plugin to lazy highlight code blocks

## Usage

```js
import { Editor } from 'bytemd';
import highlightLazy from '@bytemd/plugin-highlight-lazy';

new Editor({
  target: document.body,
  props: {
    plugins: [
      highlightLazy(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
