<script>
  import { onMount } from 'svelte'
  import { Editor } from 'bytemd';

  let source = `# bytemd [![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd)

## Math equation

$$
c = \\pm\\sqrt{a^2 + b^2}
$$

## Mermaid

<mermaid>
sequenceDiagram
  Alice->>John: Hello John, how are you?
  %% this is a comment
  John-->>Alice: Great!
</mermaid>

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

## Video Player

<xgplayer url="//s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo-720p.mp4" poster="//s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg" width="480" height="270" />
`

  let enabled = {
    highlight: true,
    math: true,
    graphviz: true,
    mermaid: true,
    plantuml: true,
    xgplayer: true,
  }

  let loadedPlugins = {};

  $: plugins = [
    enabled.highlight && loadedPlugins.highlight,
    enabled.math && loadedPlugins.math,
    enabled.graphviz && loadedPlugins.graphviz,
    enabled.mermaid && loadedPlugins.mermaid,
    enabled.plantuml && loadedPlugins.plantuml,
    enabled.xgplayer && loadedPlugins.xgplayer,
  ].filter(x => x)

  onMount(() => {
    import('@bytemd/plugin-highlight').then(r => { loadedPlugins.highlight = r.default() })
    import('@bytemd/plugin-math').then(r => { loadedPlugins.math = r.default() })
    import('@bytemd/plugin-graphviz').then(r => { loadedPlugins.graphviz = r.default() })
    import('@bytemd/plugin-mermaid').then(r => { loadedPlugins.mermaid = r.default() })
    import('@bytemd/plugin-plantuml').then(r => { loadedPlugins.plantuml = r.default() })
    import('@bytemd/plugin-xgplayer').then(r => { loadedPlugins.xgplayer = r.default() })
  })
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
  {#each ['math', 'graphviz', 'mermaid', 'plantuml', 'highlight', 'xgplayer'] as p}
    <label>
      <input type=checkbox bind:checked={enabled[p]} /> {p}
    </label>
  {/each}
</div>
<Editor {source} plugins={plugins} />
