# @bytemd/plugin-math

[bytemd](https://github.com/bytedance/bytemd) plugin to support math equation

## Usage

```js
import { Editor } from 'bytemd';
import math from '@bytemd/plugin-math';

new Editor({
  target: document.body,
  plugins: [math()],
});
```

## Example

```md
$$
c = \pm\sqrt{a^2 + b^2}
$$
```

## License

MIT
