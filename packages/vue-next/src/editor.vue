<template>
  <div ref="editorContainer"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, Ref } from 'vue';
import { Editor } from 'bytemd';

export default defineComponent({
  name: 'Editor',
  emits: ['change'],
  props: {
    value: String,
    plugins: Array,
    sanitize: Object,
    mode: String,
    previewDebounce: Number,
    placeholder: String,
    editorConfig: Object,
    locale: Object,
    uploadImages: Function,
  },
  setup(props, ctx) {
    const editorContainer = ref(null);
    const editor: Ref<any> = ref(null);
    onMounted(() => {
      const editorInstance = new Editor({
        target: editorContainer.value,
        props,
      });
      editorInstance.$on('change', (e: CustomEvent<{ value: string }>) => {
        ctx.emit('change', e.detail.value);
      });
      editor.value = editorInstance;
    });
    watch(
      props,
      (newValue) => {
        const copy: any = { ...newValue };
        for (let k in copy) {
          if (copy[k] === undefined) {
            delete copy[k];
          }
        }
        editor.value.$set(copy);
      },
      {
        deep: true,
      }
    );
    return {
      editorContainer,
    };
  },
});
</script>
