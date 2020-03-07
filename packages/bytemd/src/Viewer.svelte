<script>
  import unified from 'unified';
  import markdown from 'remark-parse';
  import math from 'remark-math';
  import Element from './Element.svelte';

  export let source = '';
  export let plugins = [];

  const parser = unified()
    .use(markdown)
    .use(math);
  $: ast = parser.parse(source);
  // $: console.log(ast);
</script>

<div class="markdown-body">
  <Element items={ast.children} {plugins} />
</div>
