<template>
  <div class="markdown-body" v-html="vfile" @click="handleClick($event)"></div>
</template>

<script>
import { getProcessor } from 'bytemd';

export default {
  props: ['value', 'plugins', 'sanitize'],
  computed: {
    vfile() {
      try {
        return getProcessor(this.$props).processSync(this.value);
      } catch (err) {
        console.error(err);
      }
    },
    needUpdate() {
      return [this.vfile, this.plugins, this.sanitize];
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
      if (this.plugins && this.vfile) {
        this.cbs = this.plugins.map(
          ({ effect }) =>
            effect &&
            effect({ markdownBody: this.markdownBody, vfile: this.vfile })
        );
      }
    },
    off() {
      if (this.cbs) {
        this.cbs.forEach((cb) => cb && cb());
      }
    },
    handleClick(e) {
      const $ = e.target;
      if ($.tagName !== 'A') return;

      const href = $.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const dest = this.markdownBody.querySelector(
        '#user-content-' + href.slice(1)
      );
      if (dest) dest.scrollIntoView();
    },
  },
};
</script>
