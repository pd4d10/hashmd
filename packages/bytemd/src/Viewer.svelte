<script>
  import { getParser } from './utils.js';
  import Elements from './Elements.svelte';

  export let value = '';
  export let plugins = [];

  $: parser = getParser(plugins);
  $: ast = parser.runSync(parser.parse(value));
  // $: console.log(ast);
</script>

<div class="markdown-body">
  <Elements nodes={ast.children} {plugins} />
</div>
