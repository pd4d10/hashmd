# @hashmd/plugin-medium-zoom

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-medium-zoom.svg)](https://npm.im/@hashmd/plugin-medium-zoom)

HashMD plugin to zoom images like Medium

## Usage

```js
import mediumZoom from "@hashmd/plugin-medium-zoom";
import { Editor } from "hashmd";

new Editor({
  target: document.body,
  props: {
    plugins: [
      mediumZoom(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
