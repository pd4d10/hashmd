<svelte:options immutable={true} />

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { EditorProps, BytemdEditorContext, BytemdAction } from './types';
  import cx from 'classnames';
  import { icons } from './icons';
  import delegate from './delegate';

  const dispatch = createEventDispatcher();
  let toolbar: HTMLElement;

  export let context: BytemdEditorContext;
  export let split: boolean;
  export let activeTab: false | 'write' | 'preview';
  export let fullscreen: boolean;
  export let sidebar: false | 'help' | 'toc';
  export let locale: NonNullable<EditorProps['locale']>;
  export let actions: BytemdAction[];

  interface RightAction extends BytemdAction {
    active?: boolean;
    hidden?: boolean;
  }

  $: rightActions = [
    {
      title: locale.toolbar.toc,
      icon: icons.toc,
      handler() {
        dispatch('click', 'toc');
      },
      active: sidebar === 'toc',
    },
    {
      title: locale.toolbar.help,
      icon: icons.help,
      handler() {
        dispatch('click', 'help');
      },
      active: sidebar === 'help',
    },
    {
      title: locale.toolbar.left,
      icon: icons.left,
      handler() {
        dispatch('tab', 'write');
      },
      active: activeTab === 'write',
      hidden: !split,
    },
    {
      title: locale.toolbar.right,
      icon: icons.right,
      handler() {
        dispatch('tab', 'preview');
      },
      active: activeTab === 'preview',
      hidden: !split,
    },
    {
      title: locale.toolbar.fullscreen,
      icon: fullscreen ? icons.fullscreenOff : icons.fullscreenOn,
      handler() {
        dispatch('click', 'fullscreen');
      },
    },
    {
      title: locale.toolbar.about,
      icon: icons.info,
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

        return {
          allowHTML: true,
          showOnCreate: true,
          theme: 'light-border',
          placement: 'bottom-start',
          interactive: true,
          interactiveDebounce: 100,
          arrow: false,
          offset: [0, 4],
          content: `<div class="bytemd-dropdown-items">${item.children
            .map((item0, i) => {
              const div = document.createElement('div');
              div.classList.add('bytemd-dropdown-item');
              div.setAttribute(tippyPathKey, [...paths, i].join('-'));
              if (item0.children) {
                div.classList.add(tippyClass);
              }
              // div.setAttribute('data-tippy-placement', 'right');
              div.innerHTML = `${
                item0.icon
                  ? `<span class="bytemd-dropdown-icon">${item0.icon}</span>`
                  : ''
              }<span class="bytemd-dropdown-title">${item0.title}</span>`;
              return div.outerHTML;
            })
            .join('')}</div>`,
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
        {#if item.children || item.title}
          <!-- <ToolbarButton
            title={item.title + (item.shortcut ? ` <${item.shortcut}>` : '')}
            icon={item.icon}
            on:click={(e) => {
              dispatch('active', e.detail);
              item.handler && item.handler(context);
            }}
          /> -->
          <span
            class={cx('bytemd-toolbar-icon', tippyClass)}
            bytemd-tippy-path={index}
          >
            {@html item.icon}
          </span>
        {/if}
      {/each}
    {:else}
      <span
        on:click={() => dispatch('tab', 'write')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab !== 'preview'}
        >{locale.toolbar.write}</span
      ><span
        on:click={() => dispatch('tab', 'preview')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab === 'preview'}
        >{locale.toolbar.preview}</span
      >
    {/if}
  </div>

  <div class="bytemd-toolbar-right">
    {#each rightActions as item, index}
      {#if !item.hidden}
        <span
          class={cx('bytemd-toolbar-icon', tippyClass, tippyClassRight)}
          class:bytemd-toolbar-icon-active={item.active}
          bytemd-tippy-path={index}>{@html item.icon}</span
        >
      {/if}
    {/each}
  </div>
</div>
