<script>
  import { afterUpdate } from 'svelte';
  import { processMarkdown } from './utils';

  export let value = '';
  export let markdownOptions;
  export let plugins;

  let el;

  afterUpdate(() => {
    if (plugins) {
      plugins.forEach((p) => {
        if (p.onMount) {
          p.onMount(el);
        }
      });
    }
  });

  $: html = processMarkdown({ value, plugins, markdownOptions });
</script>

<div bind:this={el} class="markdown-body">
  {@html html}
</div>
