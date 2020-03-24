<script>
  import tippy from 'tippy.js';
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click')
  }

  onMount(() => {
    if (tooltip) {
      tippy(el, { content: tooltip });
    }
  })

  let el
  export let tooltip
</script>

<style>
  span {
    cursor: pointer;
    border: 1px solid transparent;
    margin-left: 6px;
  }
  span:hover {
    border: 1px solid #aaa;
  }
  span :global(svg) {
    display: block;
    width: 24px;
    height: 24px;
    fill: #777;
  }
  span :global(path) {
    fill: #777;
  }
</style>

<span bind:this={el} on:click={handleClick}><slot /></span>
