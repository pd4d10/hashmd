# ByteMD

[![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd) [![showcase](https://github.com/bytedance/bytemd/workflows/showcase/badge.svg)](https://bytedance.github.io/bytemd/) ![test](https://github.com/bytedance/bytemd/workflows/test/badge.svg)

ByteMD is a Markdown editor component built with Svelte. It could also be used in other libraries/frameworks such as React, Vue and Angular.

> Note: It is still in development

## Features

1. **Lightweight and framework agnostic**: ByteMD is built with [Svelte](https://svelte.dev/). It compiles to vanilla JS DOM manipulation without importing any UI Framework runtime bundle, which makes it lightweight, and easily adapted to other libraries/frameworks.
2. **Easy to extend**: ByteMD has a plugin system to extend the basic Markdown syntax, which makes it easy to add additional features such as code syntax highlight, math equation and [Mermaid](https://mermaid-js.github.io/mermaid/) flowcharts. You can also [write your own plugin](#write-a-plugin) if these ones don't meet your needs.
3. **Secure by default**: [Cross-site scripting(XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack such as `<script>` and `<img onerror>` have been correctly handled by ByteMD. No need to introduce extra DOM sanitize steps.
4. **SSR compatiable**: ByteMD could be used in the [Server-side rendering(SSR)](https://ssr.vuejs.org/) environment without extra config. SSR is widely used in some cases due to its better SEO and fast time-to-content in slow network connection.

## Installation

| Package | Status | Description |
| --- | --- | --- |
| [bytemd](./packages/bytemd) | [![npm](https://img.shields.io/npm/v/bytemd)](https://npm.im/bytemd) | Svelte/Vanilla JS component |
| [@bytemd/react](./packages/react) | [![npm](https://img.shields.io/npm/v/@bytemd/react.svg)](https://npm.im/@bytemd/react) | React component |
| [@bytemd/vue](./packages/vue) | [![npm](https://img.shields.io/npm/v/@bytemd/vue.svg)](https://npm.im/@bytemd/vue) | Vue component |

## Usage

There are two components: `Editor` and `Viewer`. `Editor` is the Markdown editor, as the name suggests; `Viewer` is commonly used to display rendered Markdown results without editing.

Before using the component, remember to import CSS file to make styles correct:

```js
import 'bytemd/dist/index.css';
```

### Svelte

```svelte
<script>
  import { Editor, Viewer } from 'bytemd';
  import gfm from '@bytemd/plugin-gfm';

  let value;
  const plugins = [
    gfm(),
    // Add more plugins here
  ];

  function handleChange(e) {
    value = e.detail.value;
  }
</script>

<template>
  <Editor {value} {plugins} on:change={handleChange} />
</template>
```

### React

```js
import { Editor, Viewer } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';

const plugins = [
  gfm(),
  // Add more plugins here
];

const App = () => {
  const [value, setValue] = useState('');

  return (
    <Editor
      value={value}
      plugins={plugins}
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
  <Editor :value="value" :plugins="plugins" @change="handleChange" />
</template>

<script>
import { Editor, Viewer } from '@bytemd/vue';
import gfm from '@bytemd/plugin-gfm';

const plugins = [
  gfm(),
  // Add more plugins here
];

export default {
  components: { Editor },
  data() {
    return { value: '', plugins };
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
import gfm from '@bytemd/plugin-gfm';

const plugins = [
  gfm(),
  // Add more plugins here
];

const instance = new Editor({
  target: document.body, // DOM to render
  props: {
    value: '',
    plugins,
  },
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

![process](https://raw.githubusercontent.com/bytedance/bytemd/main/assets/process.svg)

The 2,5,7 steps are designed for user customization via ByteMD plugin API.

## Plugins

| Package | Status | Description |
| --- | --- | --- |
| [@bytemd/plugin-breaks](./packages/plugin-breaks) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-breaks.svg)](https://npm.im/@bytemd/plugin-breaks) | Support breaks |
| [@bytemd/plugin-external-links](./packages/plugin-external-links) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-external-links.svg)](https://npm.im/@bytemd/plugin-external-links) | Open external links in new window |
| [@bytemd/plugin-footnotes](./packages/plugin-footnotes) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-footnotes.svg)](https://npm.im/@bytemd/plugin-footnotes) | Support footnotes |
| [@bytemd/plugin-frontmatter](./packages/plugin-frontmatter) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-frontmatter.svg)](https://npm.im/@bytemd/plugin-frontmatter) | Parse frontmatter |
| [@bytemd/plugin-gfm](./packages/plugin-gfm) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-gfm.svg)](https://npm.im/@bytemd/plugin-gfm) | Support GFM (autolink literals, strikethrough, tables, tasklists) |
| [@bytemd/plugin-highlight](./packages/plugin-highlight) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight.svg)](https://npm.im/@bytemd/plugin-highlight) | Highlight code blocks |
| [@bytemd/plugin-highlight-ssr](./packages/plugin-highlight-ssr) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight-ssr.svg)](https://npm.im/@bytemd/plugin-highlight-ssr) | Highlight code blocks (SSR compatible) |
| [@bytemd/plugin-import-html](./packages/plugin-import-html) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-import-html.svg)](https://npm.im/@bytemd/plugin-import-html) | Import HTML by pasting or dropping |
| [@bytemd/plugin-import-image](./packages/plugin-import-image) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-import-image.svg)](https://npm.im/@bytemd/plugin-import-image) | Import image by pasting or dropping |
| [@bytemd/plugin-inject-style](./packages/plugin-inject-style) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-inject-style.svg)](https://npm.im/@bytemd/plugin-inject-style) | Support footnotes |
| [@bytemd/plugin-math](./packages/plugin-math) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-math.svg)](https://npm.im/@bytemd/plugin-math) | Support math equation |
| [@bytemd/plugin-math-ssr](./packages/plugin-math-ssr) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-math-ssr.svg)](https://npm.im/@bytemd/plugin-math-ssr) | Support math equation (SSR compatible) |
| [@bytemd/plugin-medium-zoom](./packages/plugin-medium-zoom) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-medium-zoom.svg)](https://npm.im/@bytemd/plugin-medium-zoom) | Zoom images like Medium |
| [@bytemd/plugin-mermaid](./packages/plugin-mermaid) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-mermaid.svg)](https://npm.im/@bytemd/plugin-mermaid) | Support Mermaid diagram and flowchart |
| [@bytemd/plugin-scroll-sync](./packages/plugin-scroll-sync) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-scroll-sync.svg)](https://npm.im/@bytemd/plugin-scroll-sync) | Sync scroll position of edit and preview area |
| [@bytemd/plugin-vega](./packages/plugin-vega) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-vega.svg)](https://npm.im/@bytemd/plugin-vega) | Support vega charts |

## Write a plugin

TODO

## License

MIT
