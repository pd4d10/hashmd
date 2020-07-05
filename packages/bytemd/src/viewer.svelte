<script>
  import { afterUpdate, beforeUpdate, onDestroy } from 'svelte';
  import { processMarkdown } from './utils';

  export let value = '';
  export let markdownOptions;
  export let plugins = [];

  let el;
  let cbs = [];

  function on() {
    cbs = plugins.map(({ effect }) => effect && effect(el));
  }
  function off() {
    cbs.forEach((cb) => cb && cb());
  }

  beforeUpdate(off);
  onDestroy(off);
  afterUpdate(on);

  $: html = processMarkdown({ value, plugins, markdownOptions });
</script>

<div bind:this={el} class="markdown-body">
  {@html html}
</div>
