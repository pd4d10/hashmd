<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script>
import { processMarkdown } from 'bytemd';

export default {
  props: ['value', 'markdownOptions', 'plugins'],
  mounted() {
    this.on(this.$el);
  },
  updated() {
    this.on(this.$el);
  },
  beforeUpdate() {
    this.off(this.$el);
  },
  beforeDestroy() {
    this.off(this.$el);
  },
  computed: {
    html() {
      return processMarkdown(this.$props);
    },
  },
  methods: {
    on() {
      if (this.plugins) {
        this.cbs = this.plugins.map(({ effect }) => effect && effect(this.$el));
      }
    },
    off() {
      if (this.cbs) {
        this.cbs.forEach((cb) => cb && cb());
      }
    },
  },
};
</script>
