<script>
  import unified from 'unified';
  import markdown from 'remark-parse';
  import math from 'remark-math';
  import rehype from 'remark-rehype'
  import raw from 'rehype-raw'
  import Elements from './Elements.svelte';

  export let source = '';
  export let plugins = [];

  const parser = unified()
    .use(markdown)
    .use(math)
    .use(rehype, { allowDangerousHTML: true })
    .use(raw)
  $: ast = parser.runSync(parser.parse(source))
  // $: console.log(ast);
</script>

<div class="markdown-body">
  <Elements nodes={ast.children} {plugins} />
</div>
