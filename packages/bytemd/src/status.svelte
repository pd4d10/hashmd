<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let scrollVisible: boolean;
  export let value: string;
  export let scrollSyncEnabled: boolean;

  const dispatch = createEventDispatcher();

  $: bytes = new TextEncoder().encode(value).length;
  $: lines = value.split('\n').length;
</script>

<div class="bytemd-status">
  <div class="bytemd-status-left">
    <span>Bytes: <strong>{bytes}</strong></span><span
      >Lines: <strong>{lines}</strong></span
    >
  </div>
  {#if scrollVisible}
    <div class="bytemd-status-right">
      <label
        ><input
          type="checkbox"
          checked={scrollSyncEnabled}
          on:change={(e) => dispatch('sync', !scrollSyncEnabled)}
        />Scroll sync</label
      ><span on:click={(e) => dispatch('top')}>Scroll to top</span>
    </div>
  {/if}
</div>
