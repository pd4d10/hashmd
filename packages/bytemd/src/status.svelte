<script lang="ts">
  import type { EditorProps } from './types';
  import { createEventDispatcher } from 'svelte';

  export let split: boolean;
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

  <div class="bytemd-status-right">
    {#if split}<label
        ><input
          type="checkbox"
          checked={syncEnabled}
          on:change={() => dispatch('sync', !syncEnabled)}
        />{locale.status.sync}</label
      >{/if}<span on:click={() => dispatch('top')}>{locale.status.top}</span>
  </div>
</div>
