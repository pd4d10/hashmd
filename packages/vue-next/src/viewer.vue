<template>
  <div ref="viewerRef" class="markdown-body" v-html="file" @click="handleClick"></div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import { getProcessor } from 'bytemd';

export default defineComponent({
  props: ['value', 'plugins', 'sanitize'],
  setup(props) {
    const cbs = ref();
    const viewerRef: Ref<HTMLElement | null> = ref(null);
    const file = computed(() => {
      return getProcessor(props).processSync(props.value);
    });
    const needUpdate = computed(() => {
      return [file, props.plugins, props.sanitize];
    });

    watch(
      () => needUpdate.value,
      () => {
        off();
        nextTick(() => {
          on();
        });
      },
      {
        deep: true
      }
    );

    onMounted(() => {
      on();
    });

    onUnmounted(() => {
      off();
    });

    const on = () => {
      if (props.plugins && file) {
        cbs.value = props.plugins.map((plugin: any) => {
          const viewerEffect = plugin.viewerEffect;
          return viewerEffect && viewerEffect({ markdownBody: viewerRef.value, file });
        });
      }
    };

    const off = () => {
      if (cbs.value) {
        cbs.value.forEach((cb?: Function) => cb && cb());
      }
    };
    const handleClick = (e?: Event) => {
      const $ = e?.target as Element;
      if ($.tagName !== 'A') return;

      const href = $.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const dest = viewerRef.value?.querySelector('#user-content-' + href.slice(1));
      if (dest) dest.scrollIntoView();
    };
    return {
      viewerRef,
      file,
      handleClick
    };
  }
});
</script>
