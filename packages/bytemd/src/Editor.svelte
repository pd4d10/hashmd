<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import codemirror from 'codemirror';
  import 'codemirror/mode/markdown/markdown.js';
  import Toolbar from './Toolbar.svelte';
  import Viewer from './Viewer.svelte';
  import { dataUrlFileHandler } from './utils.js'

  const dispatch = createEventDispatcher();

  export let value;
  export let containerStyle;
  export let fileHandler = dataUrlFileHandler;
  export let plugins = [];

  let textarea;
  let viewer;
  let cm;

  onMount(() => {
    cm = codemirror.fromTextArea(textarea, {
      mode: 'markdown',
      lineNumbers: true,
      lineWrapping: true,
    });
    cm.setValue(value);
    cm.on('change', () => {
      value = cm.getValue();
      dispatch('change', { value })
    });
    cm.on('scroll', (cm) => {
      requestAnimationFrame(() => {
        const editorInfo = cm.getScrollInfo()
        const ratio = editorInfo.top / (editorInfo.height - editorInfo.clientHeight)
        viewer.scrollTo(0, ratio * (viewer.scrollHeight - viewer.clientHeight))
      })
    });
  });
</script>

<style>
  .bytemd {
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
  }
  .bytemd-body {
    flex-grow: 1;
    display: flex;
    overflow: auto;
  }
  .bytemd-body :global(.CodeMirror) {
    flex: 1;
    height: 100%;
  }
  .bytemd-viewer {
    padding: 20px;
    flex: 1;
    overflow: auto;
    border-left: 1px solid #eee;
  }
</style>

<div class="bytemd" style={containerStyle}>
  <Toolbar {cm} {fileHandler} />
  <div class="bytemd-body">
    <textarea bind:this={textarea} />
    <div class="bytemd-viewer" bind:this={viewer}>
      <Viewer {value} {plugins} />
    </div>
  </div>
</div>
