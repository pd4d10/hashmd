# @bytemd/plugin-footnotes

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-footnotes.svg)](https://npm.im/@bytemd/plugin-footnotes)

[bytemd](https://github.com/bytedance/bytemd) plugin to support footnotes

## Usage

```js
import { Editor } from 'bytemd';
import footnotes from '@bytemd/plugin-footnotes';

new Editor({
  target: document.body,
  props: {
    plugins: [
      footnotes(),
      // ... other plugins
    ],
  },
});
```

## Example

```md
Here is a footnote reference,[^1]

another,[^longnote],

[^1]: Here is the footnote.
[^longnote]: Here’s one with multiple blocks.
```

## License

MIT
