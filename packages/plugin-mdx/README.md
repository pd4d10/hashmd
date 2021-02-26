# @bytemd/plugin-mdx

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-mdx.svg)](https://npm.im/@bytemd/plugin-mdx)

ByteMD plugin to support MDX

## Usage

```js
import { Editor } from 'bytemd';
import mdx from '@bytemd/plugin-mdx';

new Editor({
  target: document.body,
  props: {
    plugins: [
      mdx(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
