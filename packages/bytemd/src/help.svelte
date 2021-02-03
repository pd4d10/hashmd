<script lang="ts">
  import type { BytemdPlugin } from './types';
  import { getCheatsheetItems } from './toolbar';

  export let plugins: BytemdPlugin[];
  $: items = getCheatsheetItems(plugins);
</script>

<div class="bytemd-cheatsheet">
  <h2>Cheat Sheets</h2>
  <ul>
    {#each items as item}
      <li>
        <span class="bytemd-cheatsheet-icon">{@html item.icon}</span><span
          class="bytemd-cheatsheet-text">{item.text}</span
        ><span class="bytemd-cheatsheet-syntax">{item.syntax}</span>
      </li>
    {/each}
  </ul>
</div>
