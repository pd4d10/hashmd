<svelte:options immutable={true} />

<script lang="ts">
  import { icons } from './icons'
  import type { BytemdEditorContext, BytemdAction, BytemdLocale } from './types'
  import { createEventDispatcher, onMount } from 'svelte'
  import type { DelegateInstance } from 'tippy.js'
  import { delegate } from 'tippy.js'

  const dispatch = createEventDispatcher()
  let toolbar: HTMLElement

  export let context: BytemdEditorContext
  export let split: boolean
  export let activeTab: false | 'write' | 'preview'
  export let fullscreen: boolean
  export let sidebar: false | 'help' | 'toc'
  export let locale: BytemdLocale
  export let actions: BytemdAction[]
  export let rightAfferentActions: BytemdAction[]

  interface RightAction extends BytemdAction {
    active?: boolean
    hidden?: boolean
  }

  $: tocActive = sidebar === 'toc'
  $: helpActive = sidebar === 'help'
  $: writeActive = activeTab === 'write'
  $: previewActive = activeTab === 'preview'

  $: rightActions = [
    {
      title: tocActive ? locale.closeToc : locale.toc,
      icon: icons.AlignTextLeftOne,
      handler: {
        type: 'action',
        click() {
          dispatch('click', 'toc')
        },
      },
      active: tocActive,
    },
    {
      title: helpActive ? locale.closeHelp : locale.help,
      icon: icons.Helpcenter,
      handler: {
        type: 'action',
        click() {
          dispatch('click', 'help')
        },
      },
      active: helpActive,
    },
    {
      title: writeActive ? locale.exitWriteOnly : locale.writeOnly,
      icon: icons.LeftExpand,
      handler: {
        type: 'action',
        click() {
          dispatch('tab', 'write')
        },
      },
      active: writeActive,
      hidden: !split,
    },
    {
      title: previewActive ? locale.exitPreviewOnly : locale.previewOnly,
      icon: icons.RightExpand,
      handler: {
        type: 'action',
        click() {
          dispatch('tab', 'preview')
        },
      },
      active: previewActive,
      hidden: !split,
    },
    {
      title: fullscreen ? locale.exitFullscreen : locale.fullscreen,
      icon: fullscreen ? icons.OffScreen : icons.FullScreen,
      handler: {
        type: 'action',
        click() {
          dispatch('click', 'fullscreen')
        },
      },
    },
    {
      title: locale.source,
      icon: icons.GithubOne,
      handler: {
        type: 'action',
        click() {
          window.open('https://github.com/bytedance/bytemd')
        },
      },
    },
    ...rightAfferentActions,
  ] as RightAction[]

  const tippyClass = 'bytemd-tippy'
  const tippyClassRight = 'bytemd-tippy-right'
  const tippyPathKey = 'bytemd-tippy-path'

  function getPayloadFromElement(e: Element) {
    const paths = e
      .getAttribute(tippyPathKey)
      ?.split('-')
      ?.map((x) => parseInt(x, 10))
    if (!paths) return
    // if (!paths) {
    //   return {
    //     paths: [],
    //     item: {
    //       title: 'test',
    //       handler: actions,
    //     },
    //   };
    // }

    let item: BytemdAction = {
      title: '',
      handler: {
        type: 'dropdown',
        actions: e.classList.contains(tippyClassRight) ? rightActions : actions,
      },
    }
    paths?.forEach((index) => {
      if (item.handler?.type === 'dropdown') {
        item = item.handler.actions[index]
      }
    })

    return { paths, item: item }
  }

  let delegateInstance: DelegateInstance

  function init() {
    delegateInstance = delegate(toolbar, {
      target: `.${tippyClass}`,
      onCreate({ setProps, reference }) {
        const payload = getPayloadFromElement(reference)
        if (!payload) return
        const { item, paths } = payload
        const { handler } = item
        if (!handler) return

        if (handler.type === 'action') {
          setProps({
            content: item.title,
            onHidden(ins) {
              ins.destroy()
            },
          })
        } else if (handler.type === 'dropdown') {
          // dropdown
          const dropdown = document.createElement('div')
          dropdown.classList.add('bytemd-dropdown')

          if (item.title) {
            const dropdownTitle = document.createElement('div')
            dropdownTitle.classList.add('bytemd-dropdown-title')
            dropdownTitle.appendChild(document.createTextNode(item.title))
            dropdown.appendChild(dropdownTitle)
          }

          handler.actions.forEach((subAction, i) => {
            const dropdownItem = document.createElement('div')
            dropdownItem.classList.add('bytemd-dropdown-item')
            dropdownItem.setAttribute(tippyPathKey, [...paths, i].join('-'))
            if (subAction.handler?.type === 'dropdown') {
              dropdownItem.classList.add(tippyClass)
            }
            if (reference.classList.contains(tippyClassRight)) {
              dropdownItem.classList.add(tippyClassRight)
            }
            // div.setAttribute('data-tippy-placement', 'right');
            dropdownItem.innerHTML = `${
              subAction.icon
                ? `<div class="bytemd-dropdown-item-icon">${subAction.icon}</div>`
                : ''
            }<div class="bytemd-dropdown-item-title">${subAction.title}</div>`
            dropdown.appendChild(dropdownItem)
          })

          setProps({
            allowHTML: true,
            showOnCreate: true,
            theme: 'light-border',
            placement: 'bottom-start',
            interactive: true,
            interactiveDebounce: 50,
            arrow: false,
            offset: [0, 4],
            content: dropdown.outerHTML,
            onHidden(ins) {
              ins.destroy()
            },
            onCreate(ins) {
              ;[
                ...ins.popper.querySelectorAll('.bytemd-dropdown-item'),
              ].forEach((el, i) => {
                const actionHandler = handler.actions[i]?.handler
                if (actionHandler?.type === 'action') {
                  const { mouseenter, mouseleave } = actionHandler
                  if (mouseenter) {
                    el.addEventListener('mouseenter', () => {
                      mouseenter(context)
                    })
                  }
                  if (mouseleave) {
                    el.addEventListener('mouseleave', () => {
                      mouseleave(context)
                    })
                  }
                }
              })
            },
          })
        }
      },
    })
  }

  onMount(() => {
    init()
  })

  function handleClick(e: MouseEvent | KeyboardEvent) {
    const target = (e.target as Element).closest(`[${tippyPathKey}]`)
    if (!target) return
    const handler = getPayloadFromElement(target)?.item?.handler
    if (handler?.type === 'action') {
      handler.click(context)
    }
    delegateInstance?.destroy()
    init()
  }
</script>

<div
  class="bytemd-toolbar"
  bind:this={toolbar}
  on:click={handleClick}
  on:keydown|self={(e) => ['Enter', 'Space'].includes(e.code) && handleClick(e)}
>
  <div class="bytemd-toolbar-left">
    {#if split}
      {#each actions as item, index}
        {#if item.handler}
          <div
            class={['bytemd-toolbar-icon', tippyClass].join(' ')}
            bytemd-tippy-path={index}
          >
            {@html item.icon}
          </div>
        {/if}
      {/each}
    {:else}
      <div
        on:click={() => dispatch('tab', 'write')}
        on:keydown|self={(e) =>
          ['Enter', 'Space'].includes(e.code) && dispatch('tab', 'write')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab !== 'preview'}
      >
        {locale.write}
      </div>
      <div
        on:click={() => dispatch('tab', 'preview')}
        on:keydown|self={(e) =>
          ['Enter', 'Space'].includes(e.code) && dispatch('tab', 'preview')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab === 'preview'}
      >
        {locale.preview}
      </div>
    {/if}
  </div>

  <div class="bytemd-toolbar-right">
    {#each rightActions as item, index}
      {#if !item.hidden}
        <div
          class={['bytemd-toolbar-icon', tippyClass, tippyClassRight].join(' ')}
          class:bytemd-toolbar-icon-active={item.active}
          bytemd-tippy-path={index}
        >
          {@html item.icon}
        </div>
      {/if}
    {/each}
  </div>
</div>
