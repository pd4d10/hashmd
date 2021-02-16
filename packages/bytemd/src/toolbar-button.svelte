<svelte:options immutable={true} />

<script lang="ts">
  import type { Instance } from 'tippy.js';
  import tippy from 'tippy.js';
  import { onDestroy, onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let instance: Instance;

  onMount(() => {
    instance = tippy(el, {
      content: title,
      // animation: 'scale',
      duration: 100,
      delay: 300,
    });
  });

  onDestroy(() => {
    instance?.destroy();
  });

  $: ((title) => {
    instance?.setProps({
      content: title,
    });
  })(title);

  let el: HTMLElement;
  export let title: string;
  export let icon: string;
  export let active = false;
</script>

<span
  bind:this={el}
  on:click|stopPropagation={() => dispatch('click', el)}
  class="bytemd-toolbar-icon"
  class:bytemd-toolbar-icon-active={active}
>
  {@html icon}
</span>
