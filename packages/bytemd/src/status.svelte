<script lang="ts">
  import type { EditorProps } from './types';
  import { createEventDispatcher } from 'svelte';

  export let scrollVisible: boolean;
  export let value: string;
  export let syncEnabled: boolean;
  export let locale: NonNullable<EditorProps['locale']>;

  const dispatch = createEventDispatcher();

  $: bytes = new TextEncoder().encode(value).length;
  $: lines = value.split('\n').length;
</script>

<div class="bytemd-status">
  <div class="bytemd-status-left">
    <span>{locale.status.bytes}: <strong>{bytes}</strong></span><span
      >{locale.status.lines}: <strong>{lines}</strong></span
    >
  </div>
  {#if scrollVisible}
    <div class="bytemd-status-right">
      <label
        ><input
          type="checkbox"
          checked={syncEnabled}
          on:change={() => dispatch('sync', !syncEnabled)}
        />{locale.status.sync}</label
      ><span on:click={() => dispatch('top')}>{locale.status.top}</span>
    </div>
  {/if}
</div>
