# @bytemd/plugin-html2md-transform-feishu

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-html2md-transform-feishu.svg)](https://npm.im/@bytemd/plugin-html2md-transform-feishu)

ByteMD plugin to convert Feishu document on paste

## Usage

```js
import { Editor } from 'bytemd';
import html2MdTransformFeishu from '@bytemd/plugin-html2md-transform-feishu';

new Editor({
  target: document.body,
  props: {
    plugins: [
      html2MdTransformFeishu(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
