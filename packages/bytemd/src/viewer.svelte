<script context="module">
  // Declare callbacks here to be non-reactive
  const cbsMap = {};
</script>

<script>
  import { tick, onDestroy, onMount } from 'svelte';
  import { processMarkdown } from './utils';

  export let value = '';
  export let plugins = [];

  let el;
  const id = Date.now();

  function on() {
    cbsMap[id] = plugins.map(
      ({ viewerEffect }) => viewerEffect && viewerEffect(el)
    );
  }
  function off() {
    cbsMap[id] && cbsMap[id].forEach((cb) => cb && cb());
  }

  onDestroy(off);
  $: html = processMarkdown({ value, plugins });
  $: if (html != null && plugins) {
    off();
    tick().then(() => {
      on();
    });
  }
</script>

<div bind:this={el} class="markdown-body">
  {@html html}
</div>
