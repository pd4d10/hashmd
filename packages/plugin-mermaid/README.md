# @hashmd/plugin-mermaid

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-mermaid.svg)](https://npm.im/@hashmd/plugin-mermaid)

HashMD plugin to support Mermaid diagram

## Usage

```js
import mermaid from "@hashmd/plugin-mermaid";
import { Editor } from "hashmd";

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
