<script lang="ts" context="module">
  import type { BytemdPlugin } from './types';

  // Declare callbacks here to be non-reactive
  const cbsMap: Record<
    string,
    ReturnType<NonNullable<BytemdPlugin['viewerEffect']>>[]
  > = {};
</script>

<script lang="ts">
  import type { ViewerProps } from './types';
  import { tick, onDestroy } from 'svelte';
  import { processMarkdown } from './utils';

  export let value: ViewerProps['value'] = '';
  export let plugins: ViewerProps['plugins'];
  export let sanitize: ViewerProps['sanitize'];

  let el: HTMLElement;
  const id = Date.now();

  function on() {
    cbsMap[id] = (plugins ?? []).map(
      ({ viewerEffect }) => viewerEffect && viewerEffect(el)
    );
  }
  function off() {
    cbsMap[id] && cbsMap[id].forEach((cb) => cb && cb());
  }

  onDestroy(off);
  $: html = processMarkdown({ value, plugins, sanitize });
  $: if (html != null && plugins) {
    off();
    tick().then(() => {
      on();
    });
  }
</script>

<svelte:options immutable={true} />

<div bind:this={el} class="markdown-body">
  {@html html}
</div>
