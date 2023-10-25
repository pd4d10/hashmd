# @hashmd/plugin-math-ssr

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-math-ssr.svg)](https://npm.im/@hashmd/plugin-math-ssr)

HashMD plugin to support math formula (SSR compatible)

## Usage

```js
import math from "@hashmd/plugin-math-ssr";
import { Editor } from "hashmd";
import "katex/dist/katex.css";

new Editor({
  target: document.body,
  props: {
    plugins: [
      math(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
