# @bytemd/plugin-mermaid

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-mermaid.svg)](https://npm.im/@bytemd/plugin-mermaid)

[bytemd](https://github.com/bytedance/bytemd) plugin to support [mermaid](https://mermaid-js.github.io/mermaid/) diagram and flowchart

## Usage

```js
import { Editor } from 'bytemd';
import mermaid from '@bytemd/plugin-mermaid';

new Editor({
  target: document.body,
  props: {
    plugins: [
      mermaid(),
      // ... other plugins
    ],
  },
});
```

## Example

````md
```mermaid
sequenceDiagram
  Alice->>John: Hello John, how are you?
  %% this is a comment
  John-->>Alice: Great!
```
````

## License

MIT
