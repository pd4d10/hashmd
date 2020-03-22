# @bytemd/plugin-highlight

[bytemd](https://github.com/bytedance/bytemd) plugin to highlight code blocks

## Usage

```js
import { Editor } from 'bytemd';
import highlight from '@bytemd/plugin-highlight';

new Editor({
  target: document.body,
  plugins: [
    highlight(),
    // ... other plugins
  ],
});
```

## License

MIT
