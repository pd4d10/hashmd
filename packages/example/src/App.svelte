<script>
  import { Editor } from 'bytemd';
  let source = `# bytemd

[![npm](https://img.shields.io/npm/v/bytemd.svg)](https://npm.im/bytemd)

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

<Editor {source} />
