# @bytemd/plugin-{{name}}

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-{{name}}.svg)](https://npm.im/@bytemd/plugin-{{name}})

{{{desc}}}

## Usage

```js
import { Editor } from 'bytemd'
import {{importedName}} from '@bytemd/plugin-{{name}}'

new Editor({
  target: document.body,
  props: {
    plugins: [
      {{importedName}}(),
      // ... other plugins
    ],
  },
})
```

{{#options}}### Options

{{{options}}}
{{/options}}
{{#example}}## Example

{{{example}}}
{{/example}}
## License

MIT
