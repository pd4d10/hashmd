# @hashmd/plugin-breaks

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-breaks.svg)](https://npm.im/@hashmd/plugin-breaks)

HashMD plugin to support breaks

## Usage

```js
import breaks from "@hashmd/plugin-breaks";
import { Editor } from "hashmd";

new Editor({
  target: document.body,
  props: {
    plugins: [
      breaks(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
