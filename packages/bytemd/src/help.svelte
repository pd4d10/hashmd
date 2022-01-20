<script lang="ts">
  import type { BytemdAction, BytemdLocale } from './types'

  export let actions: BytemdAction[]
  export let locale: BytemdLocale
  export let visible: boolean

  function flatItems(actions: BytemdAction[]) {
    let items: BytemdAction[] = []

    actions.forEach((action) => {
      const { handler, cheatsheet } = action
      if (handler?.type === 'dropdown') {
        items.push(...flatItems(handler.actions))
      }
      if (cheatsheet) {
        items.push(action)
      }
    })

    return items
  }

  $: items = flatItems(actions)
</script>

<div class="bytemd-help" class:bytemd-hidden={!visible}>
  <h2>{locale.cheatsheet}</h2>
  <ul>
    {#each items as action}
      {#if action.cheatsheet}
        <li>
          <div class="bytemd-help-icon">{@html action.icon}</div>
          <div class="bytemd-help-title">{action.title}</div>
          <div class="bytemd-help-content">
            <code>{action.cheatsheet}</code>
          </div>
        </li>
      {/if}
    {/each}
  </ul>
  <h2>{locale.shortcuts}</h2>
  <ul>
    {#each items as action}
      {#if action.handler && action.handler.type === 'action' && action.handler.shortcut}
        <li>
          <div class="bytemd-help-icon">{@html action.icon}</div>
          <div class="bytemd-help-title">{action.title}</div>
          <div class="bytemd-help-content">
            <kbd>{action.handler.shortcut}</kbd>
          </div>
        </li>
      {/if}
    {/each}
  </ul>
</div>
