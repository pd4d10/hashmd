import App from './App.svelte';
import 'codemirror/lib/codemirror.css';
import 'katex/dist/katex.css';
import 'highlight.js/styles/vs.css';
import 'github-fork-ribbon-css/gh-fork-ribbon.css';
import 'github-markdown-css';
import 'tippy.js/dist/tippy.css';

const app = new App({
  target: document.getElementById('root'),
});

export default app;
