<script>
  import { afterUpdate } from 'svelte';
  import { processMarkdown } from './utils';

  export let value = '';
  export let plugins = [];

  let el;

  afterUpdate(() => {
    plugins.forEach((p) => {
      if (p.onMount) {
        p.onMount(el);
      }
    });
  });

  $: html = processMarkdown(value, plugins);
  // $: console.log(html);
</script>

<div bind:this={el} class="markdown-body">
  {@html html}
</div>
