<script>
  import unified from 'unified';
  import markdown from 'remark-parse';
  import rehype from 'remark-rehype'
  import raw from 'rehype-raw'
  import Elements from './Elements.svelte';

  export let source = '';
  export let plugins = [];

  $: getParser = () => {
    let parser = unified()
      .use(markdown)
      .use(rehype, { allowDangerousHTML: true })

    plugins.forEach(p => {
      if (Array.isArray(p.transformer)) {
        parser = parser.use(...p.transformer)
      } else if (p.transformer) {
        parser = parser.use(p.transformer)
      }
    })

    return parser.use(raw)
  }
  $: parser = getParser()
  $: ast = parser.runSync(parser.parse(source))
  $: console.log(ast);
</script>

<div class="markdown-body">
  <Elements nodes={ast.children} {plugins} />
</div>
