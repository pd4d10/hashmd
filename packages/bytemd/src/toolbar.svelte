<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ToolbarButton from './toolbar-button.svelte';
  import { getItemMap } from './toolbar';
  import type { EditorProps, EditorContext, BytemdPlugin } from './types';
  import { Info } from '@icon-park/svg';

  const dispatch = createEventDispatcher();

  export let context: EditorContext;
  export let mode: EditorProps['mode'];
  export let activeTab: number;
  export let plugins: EditorProps['plugins'];
  export let toolbar: EditorProps['toolbar'];

  function normalize(itemMap: NonNullable<BytemdPlugin['toolbar']>) {
    if (toolbar == null) {
      return Object.keys(itemMap);
    }
    if (typeof toolbar === 'function') {
      return toolbar(itemMap);
    }
    return toolbar;
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
          on:click={() => itemMap[id].onClick(context)} />
      {/if}
    {/each}
  {/if}

  <div style="flex-grow:1" />

  <ToolbarButton
    tooltip="About ByteMD"
    icon={Info({})}
    on:click={() => {
      window.open('https://github.com/bytedance/bytemd');
    }} />
</div>
