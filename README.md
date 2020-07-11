# ByteMD

[![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd) [![demo](https://github.com/bytedance/bytemd/workflows/demo/badge.svg)](https://bytedance.github.io/bytemd/) ![test](https://github.com/bytedance/bytemd/workflows/test/badge.svg)

Markdown editor component built with Svelte.

> Note: It is still in development.

## Usage

```js
import { Editor, Viewer } from 'bytemd';

// Editor
new Editor({
  target: document.body,
  props: {},
});

// Viewer
new Viewer({
  target: document.body,
  props: {},
});
```

## Plugins

| Package | Status | Description |
| --- | --- | --- |
| [@bytemd/plugin-footnotes](./packages/plugin-footnotes) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-footnotes.svg)](https://npm.im/@bytemd/plugin-footnotes) | support footnotes |
| [@bytemd/plugin-highlight](./packages/plugin-highlight) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight.svg)](https://npm.im/@bytemd/plugin-highlight) | highlight code blocks |
| [@bytemd/plugin-math](./packages/plugin-math) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-math.svg)](https://npm.im/@bytemd/plugin-math) | support math equation |
| [@bytemd/plugin-mermaid](./packages/plugin-mermaid) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-mermaid.svg)](https://npm.im/@bytemd/plugin-mermaid) | support [mermaid](https://mermaid-js.github.io/mermaid/) diagram and flowchart |

## License

MIT
