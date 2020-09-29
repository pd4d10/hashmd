<script lang="ts">
  import type { BytemdPlugin, ViewerProps } from './types';
  import { tick, onDestroy } from 'svelte';
  import { processMarkdown } from './utils';

  export let value: ViewerProps['value'] = '';
  export let plugins: ViewerProps['plugins'];
  export let sanitize: ViewerProps['sanitize'];

  let el: HTMLElement;
  let cbs: ReturnType<NonNullable<BytemdPlugin['viewerEffect']>>[] = [];

  function on() {
    cbs = (plugins ?? []).map(
      ({ viewerEffect }) => viewerEffect && viewerEffect(el)
    );
  }
  function off() {
    cbs.forEach((cb) => cb && cb());
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
