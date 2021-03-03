<script lang="ts">
  import type { BytemdAction, BytemdLocale } from './types';

  export let actions: BytemdAction[];
  export let locale: BytemdLocale;

  function flatItems(actions: BytemdAction[]) {
    let items: BytemdAction[] = [];

    actions.forEach((item) => {
      const { handler, cheatsheet } = item;
      if (Array.isArray(handler)) {
        items.push(...flatItems(handler));
      } else if (cheatsheet) {
        items.push(item);
      }
    });

    return items;
  }

  $: items = flatItems(actions);
</script>

<div class="bytemd-help">
  <h2>{locale.sidebar.cheatsheet}</h2>
  <ul>
    {#each items as item}
      {#if item.cheatsheet}
        <li>
          <div class="bytemd-help-icon">{@html item.icon}</div>
          <div class="bytemd-help-title">{item.title}</div>
          <div class="bytemd-help-content"><code>{item.cheatsheet}</code></div>
        </li>
      {/if}
    {/each}
  </ul>
  <h2>{locale.sidebar.shortcuts}</h2>
  <ul>
    {#each items as item}
      {#if item.shortcut && item.handler}
        <li>
          <div class="bytemd-help-icon">{@html item.icon}</div>
          <div class="bytemd-help-title">{item.title}</div>
          <div class="bytemd-help-content"><kbd>{item.shortcut}</kbd></div>
        </li>
      {/if}
    {/each}
  </ul>
</div>
