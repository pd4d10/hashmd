<script lang="ts">
  import tippy from 'tippy.js';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import type { BytemdToolbarItem } from './types';

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (tooltip) {
      tippy(el, { content: tooltip });
    }
  });

  let el: HTMLElement;
  export let tooltip: BytemdToolbarItem['tooltip'];
  export let iconHtml: BytemdToolbarItem['iconHtml'];
</script>

<svelte:options immutable={true} />

<span bind:this={el} on:click={() => dispatch('click')}>
  {@html iconHtml}
</span>
