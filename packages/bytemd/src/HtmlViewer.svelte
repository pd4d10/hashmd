<script>
  import unified from 'unified';
  import rehype from 'rehype-parse';
  import HtmlElement from './HtmlElement.svelte';

  export let value;

  $: ast = unified()
    .use(rehype, { fragment: true })
    .parse(value);

  $: console.log(ast);
</script>

<HtmlElement items={ast.children} />
