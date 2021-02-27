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
  let cbs: ReturnType<NonNullable<BytemdPlugin['viewerEffect']>>[] = [];

  function on() {
    // console.log('von');
    cbs = plugins.map((p) => p.viewerEffect?.({ markdownBody, file }));
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

  let file: VFile;
  let i = 0;

  $: try {
    file = getProcessor({
      sanitize,
      plugins: [
        ...plugins,
        {
          // remark: (p) =>
          //   p.use(() => (tree) => {
          //     console.log(tree)
          //   }),
          rehype: (p) =>
            p.use(() => (tree) => {
              tick().then(() => {
                // console.log(tree);
                dispatch('hast', tree);
              });
            }),
        },
      ],
    }).processSync(value);
    i++;

    off();
    tick().then(() => {
      on();
    });
  } catch (err) {
    console.error(err);
  }

  $: html = `${file}<!--${i}-->`;
</script>

<div bind:this={markdownBody} class="markdown-body">
  {@html html}
</div>
