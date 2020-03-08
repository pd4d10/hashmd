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

  let enabled = {
    highlight: true,
    math: true,
    graphviz: true,
    mermaid: true,
  }
  $: plugins = [
    enabled.highlight && highlight,
    enabled.math && math,
    enabled.graphviz && graphviz,
    enabled.mermaid && mermaid,
  ].filter(x => x)
</script>

<style>
  div {
    padding: 10px;
  }
</style>

<div>
  Plugins:
  <label>
    <input type=checkbox bind:checked={enabled.highlight} /> highlight
  </label>
  <label>
    <input type=checkbox bind:checked={enabled.math} /> math
  </label>
  <label>
    <input type=checkbox bind:checked={enabled.graphviz} /> graphviz
  </label>
  <label>
    <input type=checkbox bind:checked={enabled.mermaid} /> mermaid
  </label>
</div>
<Editor {source} plugins={plugins} />
