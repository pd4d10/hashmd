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

<span bind:this={el} on:click={handleClick}>
  <slot />
</span>
