<svelte:options immutable={true} />

<script lang="ts">
  import type { Root, Element } from 'hast';
  import type { EditorProps } from './types';
  import { createEventDispatcher } from 'svelte';

  export let hast: Root;
  export let currentBlockIndex: number;
  export let locale: NonNullable<EditorProps['locale']>;

  const dispatch = createEventDispatcher();

  let items: { level: number; text: string }[];
  let minLevel = 6;
  let currentHeadingIndex = 0;

  $: (() => {
    items = [];
    currentHeadingIndex = 0;

    hast.children
      .filter((v): v is Element => v.type === 'element')
      .forEach((child, index) => {
        for (let i = 6; i > 0; i--) {
          if (child.tagName === 'h' + i) {
            minLevel = Math.min(minLevel, i);
            items.push({
              level: i,
              text: child.children[0].value as string, // TODO:
            });

            // console.log(currentBlockIndex, index);
            if (currentBlockIndex >= index) {
              currentHeadingIndex = items.length - 1;
            }
          }
        }
      });
  })();
</script>

<div class="bytemd-toc">
  <h2>{locale.sidebar.toc}</h2>
  <ul>
    {#each items as item, index}
      <li
        class={`bytemd-toc-${item.level}`}
        class:bytemd-toc-active={currentHeadingIndex === index}
        class:bytemd-toc-first={item.level === minLevel}
        style={`padding-left:${(item.level - minLevel) * 16 + 8}px`}
        on:click={() => {
          dispatch('click', index);
        }}
      >
        {item.text}
      </li>
    {/each}
  </ul>
</div>
