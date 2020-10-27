# @bytemd/plugin-inject-style

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-inject-style.svg)](https://npm.im/@bytemd/plugin-inject-style)

ByteMD plugin to inject style to markdown body

## Usage

```js
import { Editor } from 'bytemd';
import injectStyle from '@bytemd/plugin-inject-style';

new Editor({
  target: document.body,
  props: {
    plugins: [
      injectStyle(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
