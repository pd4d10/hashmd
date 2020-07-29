# @bytemd/plugin-math-lazy

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-math-lazy.svg)](https://npm.im/@bytemd/plugin-math-lazy)

ByteMD plugin to lazy render math equation

## Usage

```js
import { Editor } from 'bytemd';
import mathLazy from '@bytemd/plugin-math-lazy';

new Editor({
  target: document.body,
  props: {
    plugins: [
      mathLazy(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
