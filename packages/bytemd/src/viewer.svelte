<script>
  import { processMarkdown } from './utils';

  export let value = '';
  export let remarkTransformer;
  export let rehypeTransformer;

  $: html = processMarkdown(value, remarkTransformer, rehypeTransformer);
  // $: console.log(html);
</script>

<div class="markdown-body">
  {@html html}
</div>
