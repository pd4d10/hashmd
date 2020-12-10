# @bytemd/plugin-mermaid

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-mermaid.svg)](https://npm.im/@bytemd/plugin-mermaid)

ByteMD plugin to support Mermaid diagram

## Usage

```js
import { Editor } from 'bytemd';
import mermaid from '@bytemd/plugin-mermaid';

new Editor({
  target: document.body,
  props: {
    plugins: [
      mermaid(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
