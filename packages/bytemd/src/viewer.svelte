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

  // https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
  function hashCode(s: string) {
    var h = 0,
      l = s.length,
      i = 0;
    if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
    return h;
  }

  let el: HTMLElement;
  let cbs: ReturnType<NonNullable<BytemdPlugin['effect']>>[] = [];

  function on() {
    // console.log('von');
    cbs = plugins.map((p) => p.effect?.({ $el: el, vfile }));
  }
  function off() {
    // console.log('voff');
    cbs.forEach((cb) => cb && cb());
  }

  onMount(() => {
    el.addEventListener('click', (e) => {
      const $ = e.target as HTMLElement;
      if ($.tagName !== 'A') return;

      const href = $.getAttribute('href');
      if (!href?.startsWith('#')) return;

      el.querySelector('#user-content-' + href.slice(1))?.scrollIntoView();
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

  $: html = `<!--${hashCode(value)}-->${vfile.toString()}`; // trigger re-render every time the value changes
</script>

<div bind:this={el} class="markdown-body">
  {@html html}
</div>
