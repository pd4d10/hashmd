<script>
  import tippy from 'tippy.js';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click');
  }

  onMount(() => {
    if (tooltip) {
      tippy(el, { content: tooltip });
    }
  });

  let el;
  export let tooltip;
</script>

<style>
  span {
    cursor: pointer;
    border: 1px solid transparent;
    margin-left: 6px;
  }
  span:hover :global(svg) {
    fill: #0366d6;
  }
  span :global(svg) {
    display: block;
    width: 16px;
    height: 16px;
    padding: 4px;
    fill: #586069;
  }
</style>

<span bind:this={el} on:click={handleClick}>
  <slot />
</span>
