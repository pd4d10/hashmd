# @hashmd/plugin-highlight

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-highlight.svg)](https://npm.im/@hashmd/plugin-highlight)

HashMD plugin to highlight code blocks

## Usage

```js
import highlight from "@hashmd/plugin-highlight";
import { Editor } from "hashmd";
import "highlight.js/styles/default.css";

new Editor({
  target: document.body,
  props: {
    plugins: [
      highlight(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
