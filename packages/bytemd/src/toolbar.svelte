<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ToolbarButton from './toolbar-button.svelte';
  import { getItemMap } from './toolbar';
  import type { EditorProps, EditorContext, BytemdPlugin } from './types';
  import { icons } from './icons';

  const dispatch = createEventDispatcher();

  export let context: EditorContext;
  export let mode: EditorProps['mode'];
  export let activeTab: number;
  export let plugins: EditorProps['plugins'];
  export let fullscreen: boolean;

  function normalize(itemMap: NonNullable<BytemdPlugin['toolbar']>) {
    return Object.keys(itemMap);
  }

  $: itemMap = getItemMap(plugins);
  $: normalizedIds = normalize(itemMap);
</script>

<svelte:options immutable={true} />

<div class="bytemd-toolbar">
  {#if mode === 'tab'}
    <div class="bytemd-tabs">
      <span
        on:click={() => dispatch('tab', { value: 0 })}
        class:bytemd-tab-active={activeTab === 0}>
        Write
      </span>
      <span
        on:click={() => dispatch('tab', { value: 1 })}
        class:bytemd-tab-active={activeTab === 1}>
        Preview
      </span>
    </div>
  {/if}

  {#if !(mode === 'tab' && activeTab === 1)}
    {#each normalizedIds as id}
      {#if itemMap[id]}
        <ToolbarButton
          tooltip={itemMap[id].tooltip}
          icon={itemMap[id].icon}
          style={undefined}
          on:click={() => itemMap[id].onClick(context)} />
      {/if}
    {/each}
  {/if}

  <ToolbarButton
    tooltip="About ByteMD"
    icon={icons.info}
    style="float:right"
    on:click={() => {
      window.open('https://github.com/bytedance/bytemd');
    }} />
  <ToolbarButton
    tooltip="Toggle Fullscreen"
    icon={fullscreen ? icons.fullscreenOff : icons.fullscreenOn}
    style="float:right"
    on:click={() => {
      dispatch('fullscreen');
    }} />
</div>
