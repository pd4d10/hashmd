# ByteMD

[![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd) [![demo](https://github.com/bytedance/bytemd/workflows/demo/badge.svg)](https://bytedance.github.io/bytemd/)

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
| [@bytemd/plugin-abc](./packages/plugin-abc) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-abc.svg)](https://npm.im/@bytemd/plugin-abc) | support [ABC notation](https://en.wikipedia.org/wiki/ABC_notation) |
| [@bytemd/plugin-highlight](./packages/plugin-highlight) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight.svg)](https://npm.im/@bytemd/plugin-highlight) | highlight code blocks |
| [@bytemd/plugin-math](./packages/plugin-math) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-math.svg)](https://npm.im/@bytemd/plugin-math) | support math equation |
| [@bytemd/plugin-media](./packages/plugin-media) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-media.svg)](https://npm.im/@bytemd/plugin-media) | support `<video>` and `<audio>` tags |
| [@bytemd/plugin-mermaid](./packages/plugin-mermaid) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-mermaid.svg)](https://npm.im/@bytemd/plugin-mermaid) | support [mermaid](https://mermaid-js.github.io/mermaid/) diagram and flowchart |
| [@bytemd/plugin-styled-text](./packages/plugin-styled-text) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-styled-text.svg)](https://npm.im/@bytemd/plugin-styled-text) | add styled text |
| [@bytemd/plugin-twemoji](./packages/plugin-twemoji) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-twemoji.svg)](https://npm.im/@bytemd/plugin-twemoji) | replace emoji characters with [twemoji](https://github.com/twitter/twemoji) |
| [@bytemd/plugin-xgplayer](./packages/plugin-xgplayer) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-xgplayer.svg)](https://npm.im/@bytemd/plugin-xgplayer) | support `<video>` with [xgplayer](https://github.com/bytedance/xgplayer) |

## License

MIT
