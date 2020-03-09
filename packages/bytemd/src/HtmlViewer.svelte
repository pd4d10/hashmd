<script>
  import unified from 'unified';
  import html from 'rehype-parse';
  import HtmlElements from './HtmlElements.svelte';

  export let value;
  const parser = unified().use(html, { fragment: true });
  $: ast = parser.parse(value);
  // $: console.log(ast);
</script>

<HtmlElements nodes={ast.children} />
