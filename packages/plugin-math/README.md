# @bytemd/plugin-math

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-math.svg)](https://npm.im/@bytemd/plugin-math)

ByteMD plugin to support math formula

## Usage

```js
import { Editor } from 'bytemd';
import math from '@bytemd/plugin-math';

new Editor({
  target: document.body,
  props: {
    plugins: [
      math(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
