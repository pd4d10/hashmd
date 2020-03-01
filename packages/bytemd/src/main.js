import Editor from './Editor.svelte';

const app = new Editor({
  target: document.body,
  props: {
    source: ``
  }
});

export default app;
