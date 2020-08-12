# @bytemd/plugin-html2md

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-html2md.svg)](https://npm.im/@bytemd/plugin-html2md)

ByteMD plugin to convert copied HTML to Markdown

## Usage

```js
import { Editor } from 'bytemd';
import html2Md from '@bytemd/plugin-html2md';

new Editor({
  target: document.body,
  props: {
    plugins: [
      html2Md(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
