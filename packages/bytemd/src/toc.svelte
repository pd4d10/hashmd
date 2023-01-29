<svelte:options immutable={true} />

<script lang="ts">
  import type { BytemdLocale } from './types'
  import type { Root, Element } from 'hast'
  import { createEventDispatcher } from 'svelte'
  import { visit } from 'unist-util-visit'

  export let hast: Root
  export let currentBlockIndex: number
  export let locale: BytemdLocale
  export let visible: boolean

  const dispatch = createEventDispatcher()

  let items: { level: number; text: string }[]
  let minLevel = 6
  let currentHeadingIndex = 0

  function stringifyHeading(e: Element) {
    let result = ''
    visit(e, (node) => {
      if (node.type === 'text') {
        result += node.value
      }
    })
    return result
  }

  $: (() => {
    items = []
    currentHeadingIndex = 0

    hast.children
      .filter((v): v is Element => v.type === 'element')
      .forEach((node, index) => {
        if (node.tagName[0] === 'h' && !!node.children.length) {
          const i = Number(node.tagName[1])
          minLevel = Math.min(minLevel, i)
          items.push({
            level: i,
            text: stringifyHeading(node),
          })
        }

        // console.log(currentBlockIndex, index);
        if (currentBlockIndex >= index) {
          currentHeadingIndex = items.length - 1
        }
      })
  })()
</script>

<div class="bytemd-toc" class:bytemd-hidden={!visible}>
  <h2>{locale.toc}</h2>
  <ul>
    {#each items as item, index}
      <li
        class={`bytemd-toc-${item.level}`}
        class:bytemd-toc-active={currentHeadingIndex === index}
        class:bytemd-toc-first={item.level === minLevel}
        style={`padding-left:${(item.level - minLevel) * 16 + 8}px`}
        on:click={() => {
          dispatch('click', index)
        }}
        on:keydown|self={(e) => {
          if (['Enter', 'Space'].includes(e.code)) {
            dispatch('click', index)
          }
        }}
      >
        {item.text}
      </li>
    {/each}
  </ul>
</div>
