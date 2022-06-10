<template>
  <div
    v-html="file.toString()"
    className="markdown-body"
    @click="handleClick"
    ref="markdownBody"
  ></div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  onMounted,
  onUnmounted,
  ref,
  Ref,
  nextTick,
} from 'vue'
import { getProcessor } from 'bytemd'

export default defineComponent({
  props: ['value', 'plugins', 'sanitize', 'remarkRehype'],
  setup(props, ctx) {
    const markdownBody: Ref<HTMLElement | null> = ref(null)
    const cbs = ref([])
    const file = computed(() => {
      return getProcessor(props).processSync(props.value)
    })

    const needUpdate = computed(() => {
      return [file, props.plugins, props.sanitize, props.remarkRehype]
    })

    watch(
      needUpdate,
      () => {
        off()
        nextTick(() => {
          on()
        })
      },
      { deep: true }
    )

    onMounted(() => {
      on()
    })

    onUnmounted(() => {
      off()
    })

    const handleClick = (e: MouseEvent) => {
      const $ = e.target as HTMLElement
      if ($.tagName !== 'A') return

      const href = $.getAttribute('href')
      if (!href || !href.startsWith('#')) return

      const dest = (markdownBody.value as HTMLElement).querySelector(
        '#user-content-' + href.slice(1)
      )
      if (dest) dest.scrollIntoView()
    }

    const off = () => {
      if (cbs.value.length) {
        cbs.value.forEach((cb: any) => cb && cb())
      }
    }

    const on = () => {
      if (props.plugins && file) {
        cbs.value = props.plugins.map(
          ({ viewerEffect }: any) =>
            viewerEffect &&
            viewerEffect({ markdownBody: markdownBody.value, file })
        )
      }
    }

    return { markdownBody, file, handleClick }
  },
})
</script>
