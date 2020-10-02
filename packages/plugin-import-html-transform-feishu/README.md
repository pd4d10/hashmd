# @bytemd/plugin-import-html-transformer-feishu

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-import-html-transformer-feishu.svg)](https://npm.im/@bytemd/plugin-import-html-transformer-feishu)

ByteMD plugin to import Feishu document by pasting or dropping

## Usage

```js
import { Editor } from 'bytemd';
import importHtml from '@bytemd/plugin-import-html';
import feishu from '@bytemd/plugin-import-html-transformer-feishu';

new Editor({
  target: document.body,
  props: {
    plugins: [
      importHtml({
        transformers: feishu(),
        // ... other transformers
      }),
      // ... other plugins
    ],
  },
});
```

## License

MIT
