# @bytemd/plugin-{{name}}

[bytemd](https://github.com/bytedance/bytemd) plugin to {{{desc}}}
## Usage

```js
import { Editor } from 'bytemd';
import {{name}} from '@bytemd/plugin-{{name}}';

new Editor({
  target: document.body,
  props: {
    plugins: [
      {{name}}(),
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
