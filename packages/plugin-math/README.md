# @hashmd/plugin-math

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-math.svg)](https://npm.im/@hashmd/plugin-math)

HashMD plugin to support math formula

## Usage

```js
import math from "@hashmd/plugin-math";
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
