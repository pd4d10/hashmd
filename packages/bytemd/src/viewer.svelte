<svelte:options immutable={true} />

<script lang="ts">
  import type { BytemdPlugin, ViewerProps as Props } from './types'
  import { getProcessor } from './utils'
  import type { Root } from 'hast'
  import {
    tick,
    onDestroy,
    onMount,
    createEventDispatcher,
    afterUpdate,
  } from 'svelte'
  import type { Plugin } from 'unified'
  import type { VFile } from 'vfile'

  const dispatch = createEventDispatcher<{
    hast: { hast: Root; file: VFile }
  }>()

  export let value: Props['value'] = ''
  export let plugins: NonNullable<Props['plugins']> = []
  export let sanitize: Props['sanitize'] = undefined
  export let remarkRehype: Props['remarkRehype'] = undefined

  let markdownBody: HTMLElement
  let cbs: ReturnType<NonNullable<BytemdPlugin['viewerEffect']>>[] = []

  function on() {
    // console.log('von')
    cbs = plugins.map((p) => p.viewerEffect?.({ markdownBody, file }))
  }
  function off() {
    // console.log('voff')
    cbs.forEach((cb) => cb?.())
  }

  onMount(() => {
    markdownBody.addEventListener('click', (e) => {
      const $ = e.target as HTMLElement
      if ($.tagName !== 'A') return

      const href = $.getAttribute('href')
      if (!href?.startsWith('#')) return

      markdownBody
        .querySelector('#user-content-' + href.slice(1))
        ?.scrollIntoView()
    })
  })

  onDestroy(off)

  let file: VFile
  let i = 0

  const dispatchPlugin: Plugin<any[], Root> = () => (tree, file) => {
    tick().then(() => {
      // console.log(tree);
      dispatch('hast', { hast: tree, file })
    })
  }

  $: try {
    file = getProcessor({
      sanitize,
      plugins: [
        ...plugins,
        {
          // remark: (p) =>
          //   p.use(() => (tree) => {
          //     console.log(tree)
          //   }),
          rehype: (processor) => processor.use(dispatchPlugin),
        },
      ],
      remarkRehype,
    }).processSync(value)
    i++
  } catch (err) {
    console.error(err)
  }

  afterUpdate(() => {
    // TODO: `off` should be called before DOM update
    // https://github.com/sveltejs/svelte/issues/6016
    off()
    on()
  })

  $: html = `${file}<!--${i}-->`
</script>

<div bind:this={markdownBody} class="markdown-body">
  {@html html}
</div>
