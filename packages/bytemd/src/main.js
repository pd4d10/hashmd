import Editor from './Editor.svelte';

const app = new Editor({
  target: document.getElementById('root'),
  props: {
    source: ``
  }
});

export default app;
