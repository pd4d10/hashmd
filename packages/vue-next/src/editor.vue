<template>
  <div ref="el"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue'
import { Editor } from 'bytemd'

export default defineComponent({
  props: {
    value: String,
    plugins: Array,
    sanitize: Function,
    remarkRehype: Object,
    mode: String,
    previewDebounce: Number,
    placeholder: String,
    editorConfig: Object,
    locale: Object,
    uploadImages: Function,
  },
  emits: ['change'],
  setup(props, { emit }) {
    const el: Ref<HTMLElement | null> = ref(null)
    const editorRef: Ref<Editor | null> = ref(null)

    watch(
      () => props,
      (newValue) => {
        const copy = { ...newValue }
        for (let k in copy) {
          if (copy[k] === undefined) {
            delete copy[k]
          }
        }
        editorRef.value?.$set(copy)
      },
      { deep: true }
    )

    onMounted(() => {
      const editor = new Editor({
        target: el.value!,
        props,
      })
      editor.$on('change', (e) => {
        emit('change', e.detail.value)
      })
      editorRef.value = editor
    })

    return { el }
  },
})
</script>
