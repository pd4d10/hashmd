<script>
  import tippy from 'tippy.js';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (tooltip) {
      tippy(el, { content: tooltip });
    }
  });

  let el;
  export let tooltip;
  export let iconHtml;
</script>

<span bind:this={el} on:click={() => dispatch('click')}>
  {@html iconHtml}
</span>
