<svelte:options immutable={true} />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ToolbarButton from './toolbar-button.svelte';
  import { capitalize } from 'lodash-es';
  import type { EditorProps, BytemdEditorContext, BytemdAction } from './types';
  import { icons } from './icons';

  const dispatch = createEventDispatcher();

  export let context: BytemdEditorContext;
  export let split: boolean;
  export let activeTab: number | undefined;
  export let fullscreen: boolean;
  export let sidebar: false | 'help' | 'toc';
  export let locale: NonNullable<EditorProps['locale']>;
  export let actions: BytemdAction[];
</script>

<div class="bytemd-toolbar">
  <div class="bytemd-toolbar-left">
    {#if split}
      {#each actions as item}
        {#if item.handler}
          <ToolbarButton
            tooltip={item.title + (item.shortcut ? ` <${item.shortcut}>` : '')}
            icon={item.icon}
            active={false}
            on:click={() => item.handler && item.handler(context)}
          />
        {/if}
      {/each}
    {:else}
      <span
        on:click={() => dispatch('tab', 0)}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab !== 1}
        >{locale.toolbar.write}</span
      ><span
        on:click={() => dispatch('tab', 1)}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab === 1}
        >{capitalize(locale.toolbar.preview)}</span
      >
    {/if}
  </div>

  <div class="bytemd-toolbar-right">
    {#if split}<ToolbarButton
        tooltip={locale.toolbar.left}
        icon={icons.left}
        active={activeTab === 0}
        on:click={() => {
          dispatch('tab', 0);
        }}
      /><ToolbarButton
        tooltip={locale.toolbar.right}
        icon={icons.right}
        active={activeTab === 1}
        on:click={() => {
          dispatch('tab', 1);
        }}
      />{/if}<ToolbarButton
      tooltip={locale.toolbar.toc}
      icon={icons.toc}
      active={sidebar === 'toc'}
      on:click={() => {
        dispatch('click', 'toc');
      }}
    /><ToolbarButton
      tooltip={locale.toolbar.help}
      icon={icons.help}
      active={sidebar === 'help'}
      on:click={() => {
        dispatch('click', 'help');
      }}
    /><ToolbarButton
      tooltip={locale.toolbar.fullscreen}
      icon={fullscreen ? icons.fullscreenOff : icons.fullscreenOn}
      active={false}
      on:click={() => {
        dispatch('click', 'fullscreen');
      }}
    /><ToolbarButton
      tooltip={locale.toolbar.about}
      icon={icons.info}
      active={false}
      on:click={() => {
        window.open('https://github.com/bytedance/bytemd');
      }}
    />
  </div>
</div>
