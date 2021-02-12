<script lang="ts">
  import type { BytemdLocale } from './locales/en-US';
  import type { BytemdAction } from './types';

  export let actions: BytemdAction[];
  export let locale: BytemdLocale;
</script>

<div class="bytemd-help">
  <h2>{locale.sidebar.cheatsheet}</h2>
  <ul>
    {#each actions as item}
      {#if item.cheatsheet}
        <li>
          <span class="bytemd-help-icon">{@html item.icon}</span><span
            class="bytemd-help-title">{item.title}</span
          ><span class="bytemd-help-content"
            ><code>{item.cheatsheet}</code></span
          >
        </li>
      {/if}
    {/each}
  </ul>
  <h2>{locale.sidebar.shortcuts}</h2>
  <ul>
    {#each actions as item}
      {#if item.shortcut}
        <li>
          <span class="bytemd-help-icon">{@html item.icon}</span><span
            class="bytemd-help-title">{item.title}</span
          ><span class="bytemd-help-content"><kbd>{item.shortcut}</kbd></span>
        </li>
      {/if}
    {/each}
  </ul>
</div>
