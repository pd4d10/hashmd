# @bytemd/plugin-vega

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-vega.svg)](https://npm.im/@bytemd/plugin-vega)

[bytemd](https://github.com/bytedance/bytemd) plugin to support [vega](https://vega.github.io/vega/) charts

## Usage

```js
import { Editor } from 'bytemd';
import vega from '@bytemd/plugin-vega';

new Editor({
  target: document.body,
  props: {
    plugins: [
      vega(),
      // ... other plugins
    ],
  },
});
```

## Example

````md
```vega
{
  "data": {
    "values": [
      {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
      {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
      {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal", "axis": {"labelAngle": 0}},
    "y": {"field": "b", "type": "quantitative"}
  }
}
```
````

## License

MIT
