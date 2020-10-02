# @bytemd/plugin-import-html

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-import-html.svg)](https://npm.im/@bytemd/plugin-import-html)

ByteMD plugin to import HTML by pasting or dropping

## Usage

```js
import { Editor } from 'bytemd';
import importHtml from '@bytemd/plugin-import-html';

new Editor({
  target: document.body,
  props: {
    plugins: [
      importHtml(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
