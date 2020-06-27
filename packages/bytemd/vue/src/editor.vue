<template>
  <div></div>
</template>

<script>
import * as bytemd from 'bytemd';

export default {
  props: [
    'value',
    'mode',
    'containerStyle',
    'fileHandler',
    'plugins',
    'editorConfig',
    'toolbar',
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
