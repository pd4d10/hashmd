<template>
  <div></div>
</template>

<script>
import * as bytemd from 'bytemd';

export default {
  props: [
    'value',
    'markdownOptions',
    'plugins',
    'mode',
    'containerStyle',
    'fileHandler',
    'editorConfig',
    'toolbarItems',
    'debounceMs',
  ],
  mounted() {
    const editor = new bytemd.Editor({
      target: this.$el,
      props: this.$props,
    });
    editor.$on('change', (e) => {
      this.$emit('change', e.detail.value);
    });
    editor.$on('mount', (e) => {
      this.$emit('mount', e.detail.cm);
    });
    this.editor = editor;
  },
  watch: {
    $props: {
      handler(newValue, oldValue) {
        this.editor.$set({ ...newValue });
      },
      deep: true,
    },
  },
};
</script>
