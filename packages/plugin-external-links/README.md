# @bytemd/plugin-external-links

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-external-links.svg)](https://npm.im/@bytemd/plugin-external-links)

ByteMD plugin to open external links in new window

## Usage

```js
import { Editor } from 'bytemd';
import externalLinks from '@bytemd/plugin-external-links';

new Editor({
  target: document.body,
  props: {
    plugins: [
      externalLinks(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
