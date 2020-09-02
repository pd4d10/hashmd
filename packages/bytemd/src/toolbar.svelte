<script>
  import { createEventDispatcher } from 'svelte';
  import ToolbarButton from './toolbar-button.svelte';
  import { getItems } from './toolbar';

  const dispatch = createEventDispatcher();

  export let cm;
  export let mode;
  export let activeTab;
  export let plugins;

  $: items = getItems(plugins);
</script>

<svelte:options immutable={true} />

<div class="bytemd-toolbar">
  {#if mode === 'tab'}
    <div class="bytemd-tabs">
      <span
        on:click={() => dispatch('tab', { value: 0 })}
        class:active={activeTab === 0}>
        Write
      </span>
      <span
        on:click={() => dispatch('tab', { value: 1 })}
        class:active={activeTab === 1}>
        Preview
      </span>
    </div>
  {/if}

  {#if !(mode === 'tab' && activeTab === 1)}
    {#each items.left as { tooltip, iconHtml, onClick }}
      <ToolbarButton {tooltip} {iconHtml} on:click={() => onClick(cm)} />
    {/each}
  {/if}

  <span style="flex-grow:1" />
  {#each items.right as { tooltip, iconHtml, onClick }}
    <ToolbarButton {tooltip} {iconHtml} on:click={() => onClick(cm)} />
  {/each}
</div>
