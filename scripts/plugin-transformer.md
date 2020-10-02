# @bytemd/plugin-import-html-transformer-{{name}}

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-import-html-transformer-{{name}}.svg)](https://npm.im/@bytemd/plugin-import-html-transformer-{{name}})

{{{desc}}}

## Usage

```js
import { Editor } from 'bytemd';
import importHtml from '@bytemd/plugin-import-html';
import {{name}} from '@bytemd/plugin-import-html-transformer-{{name}}';

new Editor({
  target: document.body,
  props: {
    plugins: [
      importHtml({
        transformers: {{name}}(),
        // ... other transformers
      }),
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
