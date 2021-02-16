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
  export let activeTab: false | 'write' | 'preview';
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
            title={item.title + (item.shortcut ? ` <${item.shortcut}>` : '')}
            icon={item.icon}
            on:click={(e) => {
              dispatch('active', e.detail);
              item.handler && item.handler(context);
            }}
          />
        {/if}
      {/each}
    {:else}
      <span
        on:click={() => dispatch('tab', 'write')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab !== 'preview'}
        >{locale.toolbar.write}</span
      ><span
        on:click={() => dispatch('tab', 'preview')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab === 'preview'}
        >{capitalize(locale.toolbar.preview)}</span
      >
    {/if}
  </div>

  <div class="bytemd-toolbar-right">
    {#if split}<ToolbarButton
        title={locale.toolbar.left}
        icon={icons.left}
        active={activeTab === 'write'}
        on:click={() => {
          dispatch('tab', 'write');
        }}
      /><ToolbarButton
        title={locale.toolbar.right}
        icon={icons.right}
        active={activeTab === 'preview'}
        on:click={() => {
          dispatch('tab', 'preview');
        }}
      />{/if}<ToolbarButton
      title={locale.toolbar.toc}
      icon={icons.toc}
      active={sidebar === 'toc'}
      on:click={() => {
        dispatch('click', 'toc');
      }}
    /><ToolbarButton
      title={locale.toolbar.help}
      icon={icons.help}
      active={sidebar === 'help'}
      on:click={() => {
        dispatch('click', 'help');
      }}
    /><ToolbarButton
      title={locale.toolbar.fullscreen}
      icon={fullscreen ? icons.fullscreenOff : icons.fullscreenOn}
      on:click={() => {
        dispatch('click', 'fullscreen');
      }}
    /><ToolbarButton
      title={locale.toolbar.about}
      icon={icons.info}
      on:click={() => {
        window.open('https://github.com/bytedance/bytemd');
      }}
    />
  </div>
</div>
