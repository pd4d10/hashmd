<script>
  import { processMarkdown } from './utils';

  export let value = '';
  export let plugins = [];

  $: html = processMarkdown(value, plugins);
  // $: console.log(html);
</script>

<div class="markdown-body">
  {@html html}
</div>
