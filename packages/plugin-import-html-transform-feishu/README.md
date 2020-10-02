# @bytemd/plugin-import-html-transform-feishu

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-import-html-transform-feishu.svg)](https://npm.im/@bytemd/plugin-import-html-transform-feishu)

ByteMD plugin to import Feishu document by pasting or dropping

## Usage

```js
import { Editor } from 'bytemd';
import importHtmlTransformFeishu from '@bytemd/plugin-import-html-transform-feishu';

new Editor({
  target: document.body,
  props: {
    plugins: [
      importHtmlTransformFeishu(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
