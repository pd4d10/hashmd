<script lang="ts">
  import type { VFile } from 'vfile';
  import type { BytemdPlugin, ViewerProps } from './types';
  import { tick, onDestroy, onMount, createEventDispatcher } from 'svelte';
  import { getProcessor } from './utils';

  export let value: ViewerProps['value'] = '';
  export let plugins: ViewerProps['plugins'];
  export let sanitize: ViewerProps['sanitize'];

  const dispatch = createEventDispatcher();

  // https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
  function hashCode(s: string) {
    var h = 0,
      l = s.length,
      i = 0;
    if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
    return h;
  }

  let el: HTMLElement;
  let cbs: ReturnType<NonNullable<BytemdPlugin['viewerEffect']>>[] = [];

  function on() {
    cbs = (plugins ?? []).map((p) => p.viewerEffect?.({ $el: el, result }));
  }
  function off() {
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

  let result: VFile;

  $: try {
    const processor = getProcessor({
      plugins: [
        ...(plugins ?? []),
        {
          rehype: (p) =>
            p.use(() => (tree) => {
              // wait the next tick to make sure the initial AST could be dispatched
              tick().then(() => {
                dispatch('hast', tree);
              });
            }),
        },
      ],
      sanitize,
    });
    result = processor.processSync(value);
  } catch (err) {
    console.error(err);
  }

  $: html = `<!--${hashCode(value)}-->${result}`; // trigger re-render every time the value changes

  $: if (result && plugins) {
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
