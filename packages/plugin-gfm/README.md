# @hashmd/plugin-gfm

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-gfm.svg)](https://npm.im/@hashmd/plugin-gfm)

HashMD plugin to support GFM (autolink literals, strikethrough, tables, tasklists)

## Usage

```js
import gfm from "@hashmd/plugin-gfm";
import { Editor } from "hashmd";

new Editor({
  target: document.body,
  props: {
    plugins: [
      gfm(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
