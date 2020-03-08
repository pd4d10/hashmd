<script>
  import { Editor } from 'bytemd';
  import highlight from '@bytemd/plugin-highlight'
  import math from '@bytemd/plugin-math'
  import graphviz from '@bytemd/plugin-graphviz'
  let source = `# bytemd

[![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd)

$$
c = \\pm\\sqrt{a^2 + b^2}
$$

## Usage

\`\`\`js
import { Editor, Viewer } from 'bytemd';

// Editor
new Editor({
  target: document.body,
  props: {}
});

// Viewer
new Viewer({
  target: document.body,
  props: {}
});
\`\`\`

## License

MIT
`
</script>

<Editor {source} plugins={[highlight, math, graphviz, mermaid]} />
