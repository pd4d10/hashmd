<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script>
import { processMarkdown } from 'bytemd';

export default {
  props: ['value', 'markdownOptions', 'plugins'],
  mounted() {
    if (this.plugins) {
      this.plugins.forEach(({ onMount }) => {
        if (onMount) onMount(this.$el);
      });
    }
  },
  computed: {
    html() {
      return processMarkdown(this.$props);
    },
  },
};
</script>
