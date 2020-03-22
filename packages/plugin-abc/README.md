# @bytemd/plugin-abc

[bytemd](https://github.com/bytedance/bytemd) plugin to support [ABC notation](https://en.wikipedia.org/wiki/ABC_notation)

## Usage

```js
import { Editor } from 'bytemd';
import abc from '@bytemd/plugin-abc';

new Editor({
  target: document.body,
  props: {
    plugins: [
      abc(),
      // ... other plugins
    ],
  },
});
```

## Example

````md
```abc
X:1
T:The Legacy Jig
M:6/8
L:1/8
R:jig
K:G
GFG BAB | gfg gab | GFG BAB | d2A AFD |
GFG BAB | gfg gab | age edB |1 dBA AFD :|2 dBA ABd |:
efe edB | dBA ABd | efe edB | gdB ABd |
efe edB | d2d def | gfe edB |1 dBA ABd :|2 dBA AFD |]
```
````

## License

MIT
