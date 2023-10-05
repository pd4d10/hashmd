# @hashmd/plugin-gemoji

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-gemoji.svg)](https://npm.im/@hashmd/plugin-gemoji)

HashMD plugin to support Gemoji shortcodes

## Usage

```js
import gemoji from "@hashmd/plugin-gemoji";
import { Editor } from "hashmd";

new Editor({
  target: document.body,
  props: {
    plugins: [
      gemoji(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
