<template>
  <div ref="editorRef"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue';
import { Editor } from 'bytemd';

export default defineComponent({
  props: {
    value: String,
    plugins: Array,
    sanitize: Object,
    mode: String,
    previewDebounce: Number,
    placeholder: String,
    editorConfig: Object,
    locale: Object,
    uploadImages: Function
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const editorRef: Ref<HTMLElement | null> = ref(null);
    const editorEditor: Ref<Editor | null> = ref(null);

    watch(
      () => props,
      (newValue) => {
        const copy: Partial<any> = { ...newValue };
        for (let k in copy) {
          if (copy[k] === undefined) {
            delete copy[k];
          }
        }
        if (editorEditor.value) {
          editorEditor.value.$set(copy);
        }
      },
      {
        deep: true
      }
    );

    onMounted(() => {
      bytemdEditorInit();
    });

    const bytemdEditorInit = () => {
      const editor = new Editor({
        target: editorRef.value,
        props
      });
      editor.$on('change', (e: any) => {
        emit('update:value', e.detail.value);
      });
      editorEditor.value = editor;
    };
    return {
      editorRef
    };
  }
});
</script>
