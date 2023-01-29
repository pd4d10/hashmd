<script lang="ts">
  import type { BytemdLocale } from './types'
  import { createEventDispatcher } from 'svelte'
  // @ts-ignore
  import wordCount from 'word-count'

  export let showSync: boolean
  export let value: string
  export let syncEnabled: boolean
  export let locale: BytemdLocale
  export let islimited: boolean

  const dispatch = createEventDispatcher()

  $: words = wordCount(value)
  $: lines = value.split('\n').length
</script>

<div class="bytemd-status">
  <div class="bytemd-status-left">
    <span>
      {locale.words}: <strong>{words}</strong>
    </span>
    <span>
      {locale.lines}: <strong>{lines}</strong>
    </span>
    {#if islimited}
      <span class="bytemd-status-error">{locale.limited}</span>
    {/if}
  </div>

  <div class="bytemd-status-right">
    {#if showSync}
      <label>
        <input
          type="checkbox"
          checked={syncEnabled}
          on:change={() => dispatch('sync', !syncEnabled)}
        />
        {locale.sync}
      </label>
    {/if}
    <span
      on:click={() => dispatch('top')}
      on:keydown|self={(e) =>
        ['Enter', 'Space'].includes(e.code) && dispatch('top')}
      >{locale.top}</span
    >
  </div>
</div>
