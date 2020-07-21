# @bytemd/plugin-vega

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-vega.svg)](https://npm.im/@bytemd/plugin-vega)

ByteMD plugin to support vega charts

## Usage

```js
import { Editor } from 'bytemd';
import vega from '@bytemd/plugin-vega';

new Editor({
  target: document.body,
  props: {
    plugins: [
      vega(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
