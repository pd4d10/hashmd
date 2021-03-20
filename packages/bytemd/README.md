# ByteMD

![test](https://github.com/bytedance/bytemd/workflows/test/badge.svg)

ByteMD is a Markdown editor component built with Svelte. It could also be used in other libraries/frameworks such as React, Vue and Angular.

## Features

1. **Lightweight and framework agnostic**: ByteMD is built with [Svelte](https://svelte.dev/). It compiles to vanilla JS DOM manipulation without importing any UI Framework runtime bundle, which makes it lightweight, and easily adapted to other libraries/frameworks.
2. **Easy to extend**: ByteMD has a plugin system to extend the basic Markdown syntax, which makes it easy to add additional features such as code syntax highlight, math equation and [Mermaid](https://mermaid-js.github.io/mermaid/) flowcharts. You can also [write your own plugin](#write-a-plugin) if these ones don't meet your needs.
3. **Secure by default**: [Cross-site scripting(XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack such as `<script>` and `<img onerror>` have been correctly handled by ByteMD. No need to introduce extra DOM sanitize steps.
4. **SSR compatible**: ByteMD could be used in the [Server-side rendering(SSR)](https://ssr.vuejs.org/) environment without extra config. SSR is widely used in some cases due to its better SEO and fast time-to-content in slow network connection.

## Installation

| Package | Status | Description |
| --- | --- | --- |
| [bytemd](./packages/bytemd) | [![npm](https://img.shields.io/npm/v/bytemd)](https://npm.im/bytemd) [![gzip size](https://img.badgesize.io/https://unpkg.com/bytemd/dist/index.min.js?compression=gzip)](https://unpkg.com/bytemd) | Svelte/Vanilla JS component |
| [@bytemd/react](./packages/react) | [![npm](https://img.shields.io/npm/v/@bytemd/react.svg)](https://npm.im/@bytemd/react) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/react/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/react) | React component |
| [@bytemd/vue](./packages/vue) | [![npm](https://img.shields.io/npm/v/@bytemd/vue.svg)](https://npm.im/@bytemd/vue) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/vue/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/vue) | Vue component |

### Legacy browsers support

The default entry of NPM package only supports modern browsers. There are two ways to make legacy browsers (**IE9+**) work:

1. Compile it with ESNext -> ES5 transpilers, such as [Babel](./babel.config.js)
2. Use the ES5 bundle(`dist/index.es5.js`)

Notice that polyfills are not included, and should be imported manually, see the [legacy browser example](https://github.com/bytedance/bytemd/blob/main/examples/legacy-browser/index.html).

## Usage

There are two components: `Editor` and `Viewer`. `Editor` is the Markdown editor, as the name suggests; `Viewer` is commonly used to display rendered Markdown results without editing.

Before using the component, remember to import CSS file to make styles correct:

```js
import 'bytemd/dist/index.min.css';
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

const editor = new Editor({
  target: document.body, // DOM to render
  props: {
    value: '',
    plugins,
  },
});

editor.$on('change', (e) => {
  editor.$set({ value: e.detail.value });
});
```

## Options

### Viewer

| Key        | Type                         | Description        |
| ---------- | ---------------------------- | ------------------ |
| `value`    | `string` (required)          | Markdown text      |
| `plugins`  | `BytemdPlugin[]`             | ByteMD plugin list |
| `sanitize` | `(schema: Schema) => Schema` | Sanitize strategy  |

### Editor

`Editor` component also accepts the options of `Viewer` for preview. Besides that, there are some other options:

| Key | Type | Description |
| --- | --- | --- |
| `mode` | `split`, `tab`, `auto` | Editor display mode |
| `previewDebounce` | `number` | Debounce time (ms) for preview, default: `300` |
| `placeholder` | `string` | Editor placeholder |
| `editorConfig` | [documentation](https://codemirror.net/doc/manual.html#config) | CodeMirror editor config |
| `locale` |  | i18n locale. Available locales could be found at `bytemd/lib/locales` |
| `uploadImages` | `function` | Specify how to upload images |

## Style customization

### Editor

The default height of ByteMD Editor is `300px`. It could be overridden by CSS:

```css
.bytemd {
  height: calc(100vh - 200px);
}
```

The other styles could also be overridden, see [the default style](https://github.com/bytedance/bytemd/blob/main/packages/bytemd/styles/index.scss).

### Viewer

There is no built-in styles for the Viewer. You could use third-party markdown themes, for example [juejin-markdown-themes](https://github.com/xitu/juejin-markdown-themes) and [github-markdown-css](https://github.com/sindresorhus/github-markdown-css).

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
| [@bytemd/plugin-breaks](./packages/plugin-breaks) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-breaks.svg)](https://npm.im/@bytemd/plugin-breaks) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-breaks/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-breaks) | Support breaks |
| [@bytemd/plugin-footnotes](./packages/plugin-footnotes) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-footnotes.svg)](https://npm.im/@bytemd/plugin-footnotes) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-footnotes/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-footnotes) | Support footnotes |
| [@bytemd/plugin-frontmatter](./packages/plugin-frontmatter) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-frontmatter.svg)](https://npm.im/@bytemd/plugin-frontmatter) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-frontmatter/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-frontmatter) | Parse frontmatter |
| [@bytemd/plugin-gemoji](./packages/plugin-gemoji) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-gemoji.svg)](https://npm.im/@bytemd/plugin-gemoji) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-gemoji/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-gemoji) | Support Gemoji shortcodes |
| [@bytemd/plugin-gfm](./packages/plugin-gfm) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-gfm.svg)](https://npm.im/@bytemd/plugin-gfm) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-gfm/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-gfm) | Support GFM (autolink literals, strikethrough, tables, tasklists) |
| [@bytemd/plugin-highlight](./packages/plugin-highlight) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight.svg)](https://npm.im/@bytemd/plugin-highlight) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-highlight/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-highlight) | Highlight code blocks |
| [@bytemd/plugin-highlight-ssr](./packages/plugin-highlight-ssr) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-highlight-ssr.svg)](https://npm.im/@bytemd/plugin-highlight-ssr) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-highlight-ssr/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-highlight-ssr) | Highlight code blocks (SSR compatible) |
| [@bytemd/plugin-math](./packages/plugin-math) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-math.svg)](https://npm.im/@bytemd/plugin-math) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-math/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-math) | Support math formula |
| [@bytemd/plugin-math-ssr](./packages/plugin-math-ssr) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-math-ssr.svg)](https://npm.im/@bytemd/plugin-math-ssr) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-math-ssr/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-math-ssr) | Support math formula (SSR compatible) |
| [@bytemd/plugin-medium-zoom](./packages/plugin-medium-zoom) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-medium-zoom.svg)](https://npm.im/@bytemd/plugin-medium-zoom) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-medium-zoom/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-medium-zoom) | Zoom images like Medium |
| [@bytemd/plugin-mermaid](./packages/plugin-mermaid) | [![npm](https://img.shields.io/npm/v/@bytemd/plugin-mermaid.svg)](https://npm.im/@bytemd/plugin-mermaid) [![gzip size](https://img.badgesize.io/https://unpkg.com/@bytemd/plugin-mermaid/dist/index.min.js?compression=gzip)](https://unpkg.com/@bytemd/plugin-mermaid) | Support Mermaid diagram |

## Write a plugin

TODO: plugin API not stable yet

## License

MIT
