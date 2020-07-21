# @bytemd/plugin-{{name}}

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-{{name}}.svg)](https://npm.im/@bytemd/plugin-{{name}})

{{{desc}}}

## Usage

```js
import { Editor } from 'bytemd';
import {{camelName}} from '@bytemd/plugin-{{name}}';

new Editor({
  target: document.body,
  props: {
    plugins: [
      {{camelName}}(),
      // ... other plugins
    ],
  },
});
```

{{#options}}### Options

{{{options}}}
{{/options}}
{{#example}}## Example

{{{example}}}
{{/example}}
## License

MIT
