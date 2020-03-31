# @bytemd/plugin-twemoji

[bytemd](https://github.com/bytedance/bytemd) plugin to replace emoji characters with [twemoji](https://github.com/twitter/twemoji)

## Usage

```js
import { Editor } from 'bytemd';
import twemoji from '@bytemd/plugin-twemoji';

new Editor({
  target: document.body,
  props: {
    plugins: [
      twemoji(),
      // ... other plugins
    ],
  },
});
```

## License

MIT
