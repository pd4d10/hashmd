<script>
  import unified from 'unified';
  import markdown from 'remark-parse';
  import math from 'remark-math';
  import Element from './Element.svelte';

  export let source;

  $: ast = unified()
    .use(markdown)
    .use(math)
    .parse(source);

  $: console.log(ast);
</script>

<div class="markdown-body">
  <Element items={ast.children} />
</div>
