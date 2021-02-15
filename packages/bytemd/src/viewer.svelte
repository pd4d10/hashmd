<svelte:options immutable={true} />

<script lang="ts">
  import type { VFile } from 'vfile';
  import type { BytemdPlugin, ViewerProps } from './types';
  import { tick, onDestroy, onMount, createEventDispatcher } from 'svelte';
  import { getProcessor } from './utils';

  const dispatch = createEventDispatcher();

  export let value: ViewerProps['value'] = '';
  export let plugins: NonNullable<ViewerProps['plugins']> = [];
  export let sanitize: ViewerProps['sanitize'];

  let markdownBody: HTMLElement;
  let cbs: ReturnType<NonNullable<BytemdPlugin['effect']>>[] = [];

  function on() {
    // console.log('von');
    cbs = plugins.map((p) => p.effect?.({ markdownBody, vfile }));
  }
  function off() {
    // console.log('voff');
    cbs.forEach((cb) => cb && cb());
  }

  onMount(() => {
    markdownBody.addEventListener('click', (e) => {
      const $ = e.target as HTMLElement;
      if ($.tagName !== 'A') return;

      const href = $.getAttribute('href');
      if (!href?.startsWith('#')) return;

      markdownBody
        .querySelector('#user-content-' + href.slice(1))
        ?.scrollIntoView();
    });
  });

  onDestroy(off);

  let vfile: VFile;

  $: _plugins = [
    ...plugins,
    {
      rehype: (p) =>
        p.use(() => (tree) => {
          tick().then(() => {
            dispatch('hast', tree);
          });
        }),
    },
  ];

  $: try {
    vfile = getProcessor({ sanitize, plugins: _plugins }).processSync(value);

    off();
    tick().then(() => {
      on();
    });
  } catch (err) {
    console.error(err);
  }

  $: html = `<!--${Date.now()}-->${vfile}`; // add timestamp to trigger re-render every time
</script>

<div bind:this={markdownBody} class="markdown-body">
  {@html html}
</div>
