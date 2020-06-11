import 'bytemd/dist/index.css';
import 'highlight.js/styles/vs.css';
// import 'github-markdown-css';
import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'world',
  },
});

export default app;
