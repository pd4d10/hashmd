<script>
  import unified from 'unified';
  import html from 'rehype-parse';
  import HtmlElement from './HtmlElement.svelte';

  export let value;
  const parser = unified().use(html, { fragment: true });
  $: ast = parser.parse(value);
  // $: console.log(ast);
</script>

<HtmlElement nodes={ast.children} />
