<script>
  import { Editor } from 'bytemd';
  import highlight from '@bytemd/plugin-highlight'
  import math from '@bytemd/plugin-math'
  import graphviz from '@bytemd/plugin-graphviz'
  import mermaid from '@bytemd/plugin-mermaid'
  import plantuml from '@bytemd/plugin-plantuml'

  let source = `# bytemd [![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd)

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

## Graphviz

\`\`\`dot
digraph G {
	subgraph cluster_0 {
		style=filled;
		color=lightgrey;
		node [style=filled,color=white];
		a0 -> a1 -> a2 -> a3;
		label = "process #1";
	}
	subgraph cluster_1 {
		node [style=filled];
		b0 -> b1 -> b2 -> b3;
		label = "process #2";
		color=blue
	}
	start -> a0;
	start -> b0;
	a1 -> b3;
	b2 -> a3;
	a3 -> a0;
	a3 -> end;
	b3 -> end;
	start [shape=Mdiamond];
	end [shape=Msquare];
}
\`\`\`

## PlantUML

\`\`\`plantuml
A -> B: Hello
\`\`\`

## Code syntax highlight

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
    plantuml: true,
    // twemoji: true,
  }
  $: plugins = [
    enabled.highlight && highlight(),
    enabled.math && math(),
    enabled.graphviz && graphviz(),
    enabled.mermaid && mermaid(),
    enabled.plantuml && plantuml(),
    // enabled.twemoji && twemoji()
  ].filter(x => x)

  import('@bytemd/plugin-twemoji').then(console.log)
</script>

<style>
  div {
    padding: 10px;
  }
  :global(.bytemd-body) {
    height: 90vh!important;
  }
</style>

<div>
  Plugins:
  <label>
    <input type=checkbox bind:checked={enabled.math} /> math
  </label>
  <label>
    <input type=checkbox bind:checked={enabled.graphviz} /> graphviz
  </label>
  <label>
    <input type=checkbox bind:checked={enabled.mermaid} /> mermaid
  </label>
  <label>
    <input type=checkbox bind:checked={enabled.plantuml} /> plantuml
  </label>
  <label>
    <input type=checkbox bind:checked={enabled.highlight} /> highlight
  </label>
</div>
<Editor {source} plugins={plugins} />
