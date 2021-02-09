<svelte:options immutable={true} />

<script lang="ts">
  import type { Instance } from 'tippy.js';
  import tippy from 'tippy.js';
  import { afterUpdate, onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let instance: Instance;

  onMount(() => {
    instance = tippy(el, {
      content: tooltip,
      animation: 'scale',
      duration: 100,
      delay: 100,
    });
  });

  afterUpdate(() => {
    instance.setProps({
      content: tooltip,
    });
  });

  let el: HTMLElement;
  export let tooltip: string;
  export let icon: string;
  export let style: string | undefined;
  export let active: boolean;
</script>

<span
  bind:this={el}
  on:click={() => dispatch('click')}
  {style}
  class="bytemd-toolbar-icon"
  class:bytemd-toolbar-icon-active={active}
>
  {@html icon}
</span>
