# @hashmd/plugin-{{name}}

[![npm](https://img.shields.io/npm/v/@hashmd/plugin-{{name}}.svg)](https://npm.im/@hashmd/plugin-{{name}})

{{{desc}}}

## Usage

```js
{{{header}}}
import { Editor } from 'hashmd'
import {{importedName}} from '@hashmd/plugin-{{name}}'

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
