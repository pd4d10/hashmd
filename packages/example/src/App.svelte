<script>
  import { Editor } from 'bytemd';
  import highlight from '@bytemd/plugin-highlight'
  import math from '@bytemd/plugin-math'
  import graphviz from '@bytemd/plugin-graphviz'
  import mermaid from '@bytemd/plugin-mermaid'
  let source = `# bytemd

[![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd)

## Math equation

$$
c = \\pm\\sqrt{a^2 + b^2}
$$

## Mermaid

\`\`\`mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    %% this is a comment
    John-->>Alice: Great!
\`\`\`

## Code

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
`
</script>

<Editor {source} plugins={[highlight, math, graphviz, mermaid]} />
