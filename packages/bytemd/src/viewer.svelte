<script>
  import { getParser } from './utils';

  export let value = '';
  export let plugins = [];

  $: parser = getParser(plugins);
  $: html = parser.processSync(value).toString();
  // $: console.log(html);
</script>

<div class="markdown-body">
  {@html html}
</div>
