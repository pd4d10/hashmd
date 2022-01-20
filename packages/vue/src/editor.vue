<template>
  <div></div>
</template>

<script>
import * as bytemd from 'bytemd';

export default {
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
    maxLength: Number,
  },
  mounted() {
    const editor = new bytemd.Editor({
      target: this.$el,
      props: this.$props,
    });
    editor.$on('change', (e) => {
      this.$emit('change', e.detail.value);
    });
    this.editor = editor;
  },
  watch: {
    $props: {
      handler(newValue, oldValue) {
        // TODO:
        const copy = { ...newValue };
        for (let k in copy) {
          if (copy[k] === undefined) {
            delete copy[k];
          }
        }
        this.editor.$set(copy);
      },
      deep: true,
    },
  },
};
</script>
