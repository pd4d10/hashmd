<svelte:options immutable={true} />

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type {
    BytemdEditorContext,
    BytemdAction,
    BytemdLocale,
  } from './types';
  import clsx from 'clsx';
  import { icons } from './icons';
  import delegate from './delegate';

  const dispatch = createEventDispatcher();
  let toolbar: HTMLElement;

  export let context: BytemdEditorContext;
  export let split: boolean;
  export let activeTab: false | 'write' | 'preview';
  export let fullscreen: boolean;
  export let sidebar: false | 'help' | 'toc';
  export let locale: BytemdLocale;
  export let actions: BytemdAction[];

  interface RightAction extends BytemdAction {
    active?: boolean;
    hidden?: boolean;
  }

  $: tocActive = sidebar === 'toc';
  $: helpActive = sidebar === 'help';
  $: writeActive = activeTab === 'write';
  $: previewActive = activeTab === 'preview';

  $: rightActions = [
    {
      title: tocActive ? locale.toolbar.closeToc : locale.toolbar.toc,
      icon: icons.toc,
      handler() {
        dispatch('click', 'toc');
      },
      active: tocActive,
    },
    {
      title: helpActive ? locale.toolbar.closeHelp : locale.toolbar.help,
      icon: icons.help,
      handler() {
        dispatch('click', 'help');
      },
      active: helpActive,
    },
    {
      title: writeActive
        ? locale.toolbar.exitWriteOnly
        : locale.toolbar.writeOnly,
      icon: icons.left,
      handler() {
        dispatch('tab', 'write');
      },
      active: writeActive,
      hidden: !split,
    },
    {
      title: previewActive
        ? locale.toolbar.exitPreviewOnly
        : locale.toolbar.previewOnly,
      icon: icons.right,
      handler() {
        dispatch('tab', 'preview');
      },
      active: previewActive,
      hidden: !split,
    },
    {
      title: fullscreen
        ? locale.toolbar.exitFullscreen
        : locale.toolbar.fullscreen,
      icon: fullscreen ? icons.fullscreenOff : icons.fullscreenOn,
      handler() {
        dispatch('click', 'fullscreen');
      },
    },
    {
      title: locale.toolbar.source,
      icon: icons.source,
      handler() {
        window.open('https://github.com/bytedance/bytemd');
      },
    },
  ] as RightAction[];

  const tippyClass = 'bytemd-tippy';
  const tippyClassRight = 'bytemd-tippy-right';
  const tippyPathKey = 'bytemd-tippy-path';

  function getPayloadFromElement(e: Element) {
    const paths = e
      .getAttribute(tippyPathKey)
      ?.split('-')
      ?.map((x) => parseInt(x, 10));
    if (!paths) return;

    let item: BytemdAction | undefined;
    paths?.forEach((index) => {
      item = (
        item ?? {
          children: e.classList.contains(tippyClassRight)
            ? rightActions
            : actions,
        }
      )?.children?.[index];
    });

    return { paths, item: item! };
  }

  let delegateInstance: ReturnType<typeof delegate>;

  function init() {
    delegateInstance = delegate(toolbar, {
      target: `.${tippyClass}`,
      getTargetProps(target) {
        const payload = getPayloadFromElement(target);
        if (!payload) return;
        const { item, paths } = payload;

        if (!item.children) {
          return {
            content: item.title,
            onHidden(ins) {
              ins.destroy();
            },
          };
        }

        const dropdown = document.createElement('div');
        dropdown.classList.add('bytemd-dropdown');

        if (item.title) {
          const dropdownTitle = document.createElement('div');
          dropdownTitle.classList.add('bytemd-dropdown-title');
          dropdownTitle.appendChild(document.createTextNode(item.title));
          dropdown.appendChild(dropdownTitle);
        }

        item.children.forEach((item0, i) => {
          const dropdownItem = document.createElement('div');
          dropdownItem.classList.add('bytemd-dropdown-item');
          dropdownItem.setAttribute(tippyPathKey, [...paths, i].join('-'));
          if (item0.children) {
            dropdownItem.classList.add(tippyClass);
          }
          // div.setAttribute('data-tippy-placement', 'right');
          dropdownItem.innerHTML = `${
            item0.icon
              ? `<div class="bytemd-dropdown-item-icon">${item0.icon}</div>`
              : ''
          }<div class="bytemd-dropdown-item-title">${item0.title}</div>`;
          dropdown.appendChild(dropdownItem);
        });

        return {
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
            ins.destroy();
          },
        };
      },
    });
  }

  onMount(() => {
    init();
  });

  function handleClick(e: MouseEvent) {
    const target = (e.target as Element).closest(`[${tippyPathKey}]`);
    if (!target) return;
    getPayloadFromElement(target)?.item?.handler?.(context);

    delegateInstance?.destroy();
    init();
  }
</script>

<div class="bytemd-toolbar" bind:this={toolbar} on:click={handleClick}>
  <div class="bytemd-toolbar-left">
    {#if split}
      {#each actions as item, index}
        {#if item.children || item.handler}
          <div
            class={clsx('bytemd-toolbar-icon', tippyClass)}
            bytemd-tippy-path={index}
          >
            {@html item.icon}
          </div>
        {/if}
      {/each}
    {:else}
      <div
        on:click={() => dispatch('tab', 'write')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab !== 'preview'}
      >
        {locale.toolbar.write}
      </div>
      <div
        on:click={() => dispatch('tab', 'preview')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab === 'preview'}
      >
        {locale.toolbar.preview}
      </div>
    {/if}
  </div>

  <div class="bytemd-toolbar-right">
    {#each rightActions as item, index}
      {#if !item.hidden}
        <div
          class={clsx('bytemd-toolbar-icon', tippyClass, tippyClassRight)}
          class:bytemd-toolbar-icon-active={item.active}
          bytemd-tippy-path={index}
        >
          {@html item.icon}
        </div>
      {/if}
    {/each}
  </div>
</div>
