# ByteMD

[![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd) [![showcase](https://github.com/bytedance/bytemd/workflows/showcase/badge.svg)](https://bytedance.github.io/bytemd/) ![test](https://github.com/bytedance/bytemd/workflows/test/badge.svg)

ByteMD is a Markdown editor component built with Svelte. It could also be used in other libraries/frameworks such as React, Vue and Angular.

## Features

1. **Lightweight and framework agnostic**: ByteMD is built with [Svelte](https://svelte.dev/). It compiles to vanilla JS DOM manipulation without importing any UI Framework runtime bundle, which makes it lightweight, and easily adapted to other libraries/frameworks.
2. **Easy to extend**: ByteMD has a plugin system to extend the basic Markdown syntax, which makes it easy to add additional features such as code syntax highlight, math equation and [Mermaid](https://mermaid-js.github.io/mermaid/) flowcharts. You can also [write your own plugin](#write-a-plugin) if these ones don't meet your needs.
3. **Secure by default**: [Cross-site scripting(XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack such as `<script>` and `<img onerror>` have been correctly handled by ByteMD. No need to introduce extra DOM sanitize steps.
4. **SSR compatiable**: ByteMD could be used in the [Server-side rendering(SSR)](https://ssr.vuejs.org/) environment without extra config. SSR is widely used in some cases due to its better SEO and fast time-to-content in slow network connection.

## Installation

```sh
npm install bytemd
# or
yarn add bytemd
```

## Usage

There are two components: `Editor` and `Viewer`. `Editor` is the Markdown editor, as the name suggests; `Viewer` is commonly used to display rendered Markdown results without editing.

### Svelte

```svelte
<template>
  <Editor {value} on:change={handleChange} />
</template>
<script>
import { Editor, Viewer } from 'bytemd'

let value;
function handleChange(e) {
  value = e.detail.value
}
</script>
```

### React

```js
import { Editor, Viewer } from 'bytemd/react';

const App = () => {
  const [value, setValue] = useState('');

  return (
    <Editor
      value={value}
      onChange={(v) => {
        setValue(v);
      }}
    />
  );
};
```

### Vue

```vue
<template>
  <Editor :value="value" @change="handleChange" />
</template>

<script>
import { Editor, Viewer } from 'bytemd/vue';

export default {
  components: {
    Editor,
  },
  data() {
    return {
      value: '',
    };
  },
  methods: {
    handleChange(v) {
      value = v;
    },
  },
};
</script>
```

### Vanilla JS

```js
import { Editor, Viewer } from 'bytemd';

const instance = new Editor({
  target: document.body, // DOM to render
  props: {},
});

instance.on('change', (e) => {
  const value = e.detail.value;
  console.log(value);
  // ...
});
```

## Technical details

ByteMD uses [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype) ecosystem to process Markdown. The complete process is as follows:

1. The markdown text is parsed to an [AST](https://github.com/syntax-tree/mdast)
2. The Markdown AST could be manipulated by several [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
3. The Markdown AST is transformed to a HTML AST
4. The HTML AST is sanitized for security reason
5. The HTML AST could be manipulated by several [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
6. The HTML AST is stringified to HTML
7. Some extra DOM manipulation after the HTML being rendered

It could also be described as a flowchart:

![process](https://github.com/bytedance/bytemd/blob/master/assets/process.svg)

The 2,5,7 steps are designed for user customization via ByteMD plugin API.

## Plugins

| Package | Version | Description |
| --- | --- | --- |
| [@bytemd/plugin-footnotes](./packages/plugin-footnotes) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-footnotes.svg)](https://npm.im/@bytemd/plugin-footnotes) | support footnotes |
| [@bytemd/plugin-highlight](./packages/plugin-highlight) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight.svg)](https://npm.im/@bytemd/plugin-highlight) | highlight code blocks |
| [@bytemd/plugin-math](./packages/plugin-math) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-math.svg)](https://npm.im/@bytemd/plugin-math) | support math equation |
| [@bytemd/plugin-mermaid](./packages/plugin-mermaid) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-mermaid.svg)](https://npm.im/@bytemd/plugin-mermaid) | support [mermaid](https://mermaid-js.github.io/mermaid/) diagram and flowchart |

## Write a plugin

TODO

## License

MIT
