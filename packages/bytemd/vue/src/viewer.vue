<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script>
import { processMarkdown } from 'bytemd';

export default {
  props: ['value', 'plugins'],
  computed: {
    html() {
      return processMarkdown(this.$props);
    },
    needUpdate() {
      return [this.html, this.plugins];
    },
  },
  watch: {
    needUpdate: {
      handler(val) {
        this.off();
        this.$nextTick(() => {
          this.on();
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.on();
  },
  beforeDestroy() {
    this.off();
  },
  methods: {
    on() {
      if (this.plugins) {
        this.cbs = this.plugins.map(
          ({ viewerEffect }) => viewerEffect && viewerEffect(this.$el)
        );
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
