<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ToolbarButton from './toolbar-button.svelte';
  import { getItems } from './toolbar';
  import type { EditorProps } from './types';

  const dispatch = createEventDispatcher();

  export let cm: CodeMirror.Editor;
  export let mode: EditorProps['mode'];
  export let activeTab: number;
  export let plugins: EditorProps['plugins'];

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

  <div style="flex-grow:1" />
  {#each items.right as { tooltip, iconHtml, onClick }}
    <ToolbarButton {tooltip} {iconHtml} on:click={() => onClick(cm)} />
  {/each}
</div>
