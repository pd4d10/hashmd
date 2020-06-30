<script>
  import { iconMap } from './icons';

  import { createEventDispatcher } from 'svelte';
  import ToolbarButton from './toolbar-button.svelte';
  import {
    handleDec,
    handleTag,
    handleBlockquote,
    handleLink,
    handleImage,
    handleTable,
    handleHeading,
    handleOl,
    handleUl,
    handleTask,
  } from './toolbar';

  const dispatch = createEventDispatcher();

  export let cm;
  export let fileHandler;
  export let mode;
  export let activeTab;
  export let toolbarItems = [];

  let fileInput;
</script>

<div class="bytemd-toolbar">
  <input
    bind:this={fileInput}
    type="file"
    accept="image/*"
    on:input={(e) => handleImage(cm, e, fileHandler)} />

  {#if mode === 'tab'}
    <span class="bytemd-tabs">
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
    </span>
  {/if}

  <ToolbarButton tooltip="heading" on:click={() => handleHeading(cm)}>
    {@html iconMap.heading}
  </ToolbarButton>
  <ToolbarButton tooltip="bold" on:click={() => handleDec(cm, '**')}>
    {@html iconMap.bold}
  </ToolbarButton>
  <ToolbarButton tooltip="italic" on:click={() => handleDec(cm, '_')}>
    {@html iconMap.italic}
  </ToolbarButton>
  <ToolbarButton tooltip="blockquote" on:click={() => handleBlockquote(cm)}>
    {@html iconMap.quote}
  </ToolbarButton>
  <ToolbarButton tooltip="link" on:click={() => handleLink(cm)}>
    {@html iconMap.link}
  </ToolbarButton>
  <ToolbarButton tooltip="image" on:click={() => fileInput.click()}>
    {@html iconMap.image}
  </ToolbarButton>
  <ToolbarButton tooltip="table" on:click={() => handleTable(cm)}>
    {@html iconMap.table}
  </ToolbarButton>
  <ToolbarButton tooltip="ordered list" on:click={() => handleOl(cm)}>
    {@html iconMap.ol}
  </ToolbarButton>
  <ToolbarButton tooltip="unordered list" on:click={() => handleUl(cm)}>
    {@html iconMap.ul}
  </ToolbarButton>
  <ToolbarButton tooltip="task list" on:click={() => handleTask(cm)}>
    {@html iconMap.tasklist}
  </ToolbarButton>

  {#each toolbarItems as item}
    {#if item.bodyHtml && item.tooltip}
      <ToolbarButton tooltip={item.tooltip}>
        {@html item.bodyHtml}
      </ToolbarButton>
    {/if}
  {/each}
</div>
