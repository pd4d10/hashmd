# @hashmd/plugin-highlight-ssr

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-highlight-ssr.svg)](https://npm.im/@hashmd/plugin-highlight-ssr)

HashMD plugin to highlight code blocks (SSR compatible)

## Usage

```js
import highlight from "@hashmd/plugin-highlight-ssr";
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
