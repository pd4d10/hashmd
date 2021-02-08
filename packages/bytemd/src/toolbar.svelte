<svelte:options immutable={true} />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ToolbarButton from './toolbar-button.svelte';
  import { capitalize } from 'lodash-es';
  import type { EditorProps, EditorContext, BytemdToolbarItem } from './types';
  import { icons } from './icons';

  const dispatch = createEventDispatcher();

  export let context: EditorContext;
  export let mode: EditorProps['mode'];
  export let activeTab: number;
  export let fullscreen: boolean;
  export let sidebar: false | 'help' | 'toc';
  export let locale: NonNullable<EditorProps['locale']>;
  export let toolbarItems: BytemdToolbarItem[];
</script>

<div class="bytemd-toolbar">
  {#if mode === 'tab'}
    <div class="bytemd-tabs">
      <span
        on:click={() => dispatch('tab', 0)}
        class:bytemd-tab-active={activeTab === 0}>{locale.toolbar.write}</span
      ><span
        on:click={() => dispatch('tab', 1)}
        class:bytemd-tab-active={activeTab === 1}
        >{capitalize(locale.toolbar.preview)}</span
      >
    </div>
  {/if}

  {#if !(mode === 'tab' && activeTab === 1)}
    {#each toolbarItems as item}
      <ToolbarButton
        tooltip={item.title}
        icon={item.icon}
        style={undefined}
        active={false}
        on:click={() => item.onClick(context)}
      />
    {/each}
  {/if}

  <ToolbarButton
    tooltip={locale.toolbar.about}
    icon={icons.info}
    style="float:right"
    active={false}
    on:click={() => {
      window.open('https://github.com/bytedance/bytemd');
    }}
  /><ToolbarButton
    tooltip={locale.toolbar.fullscreen}
    icon={fullscreen ? icons.fullscreenOff : icons.fullscreenOn}
    style="float:right"
    active={false}
    on:click={() => {
      dispatch('click', 'fullscreen');
    }}
  /><ToolbarButton
    tooltip={locale.toolbar.help}
    icon={icons.help}
    style="float:right"
    active={sidebar === 'help'}
    on:click={() => {
      dispatch('click', 'help');
    }}
  /><ToolbarButton
    tooltip={locale.toolbar.toc}
    icon={icons.toc}
    style="float:right"
    active={sidebar === 'toc'}
    on:click={() => {
      dispatch('click', 'toc');
    }}
  />
</div>
