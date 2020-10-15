<script lang="ts">
  import type { BytemdPlugin, ViewerProps } from './types';
  import { tick, onDestroy } from 'svelte';
  import { getProcessor } from './utils';

  export let value: ViewerProps['value'] = '';
  export let plugins: ViewerProps['plugins'];
  export let sanitize: ViewerProps['sanitize'];

  let el: HTMLElement;
  let cbs: ReturnType<NonNullable<BytemdPlugin['viewerEffect']>>[] = [];

  function on() {
    cbs = (plugins ?? []).map((p) => p.viewerEffect?.({ $el: el, result }));
  }
  function off() {
    cbs.forEach((cb) => cb && cb());
  }

  onDestroy(off);
  $: result = getProcessor({ plugins, sanitize }).processSync(value);
  $: if (result && plugins) {
    off();
    tick().then(() => {
      on();
    });
  }
</script>

<svelte:options immutable={true} />

<div bind:this={el} class="markdown-body">
  {@html result.toString()}
</div>
