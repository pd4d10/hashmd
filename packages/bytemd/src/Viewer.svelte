<script>
  import unified from 'unified';
  import markdown from 'remark-parse';
  import math from 'remark-math';
  import Elements from './Elements.svelte';

  export let source = '';
  export let plugins = [];

  const parser = unified()
    .use(markdown)
    .use(math);
  $: ast = parser.parse(source);
  // $: console.log(ast);
</script>

<div class="markdown-body">
  <Elements nodes={ast.children} {plugins} />
</div>
