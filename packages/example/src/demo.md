# bytemd [![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd)

## Math equation

$$
c = \pm\sqrt{a^2 + b^2}
$$

## Mermaid

```mermaid
sequenceDiagram
  Alice->>John: Hello John, how are you?
  %% this is a comment
  John-->>Alice: Great!
```

## Graphviz

```dot
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
```

## Code syntax highlight

```js
import { Editor, Viewer } from 'bytemd';

// Editor
new Editor({
  target: document.body,
  props: {},
});

// Viewer
new Viewer({
  target: document.body,
  props: {},
});
```

## Video Player

<video src="https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-1080p-30s/master/video.mp4" poster="https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-1080p-30s/master/poster.jpg"></video>

## ABC notation

```abc
X:1
T:The Legacy Jig
M:6/8
L:1/8
R:jig
K:G
GFG BAB | gfg gab | GFG BAB | d2A AFD |
GFG BAB | gfg gab | age edB |1 dBA AFD :|2 dBA ABd |:
efe edB | dBA ABd | efe edB | gdB ABd |
efe edB | d2d def | gfe edB |1 dBA ABd :|2 dBA AFD |]
```
