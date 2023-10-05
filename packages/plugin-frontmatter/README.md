# @hashmd/plugin-frontmatter

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-frontmatter.svg)](https://npm.im/@hashmd/plugin-frontmatter)

HashMD plugin to parse frontmatter

## Usage

```js
import frontmatter from "@hashmd/plugin-frontmatter";
import { Editor } from "hashmd";

new Editor({
  target: document.body,
  props: {
    plugins: [
      frontmatter(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
