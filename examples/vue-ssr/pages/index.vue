<template>
  <div>
    <div style="padding: 10px 0">
      Plugins:
      <label v-for="p in Object.keys(enabled)" :key="p">
        <input
          type="checkbox"
          :checked="enabled[p]"
          @change="handlePluginChange($event, p)"
        />
        {{ p }}
      </label>
    </div>
    <Editor
      :value="value"
      @change="handleChange"
      :plugins="enabledPlugins"
      :toolbarItems="[]"
    />
  </div>
</template>

<script>
import { Editor, Viewer } from '@bytemd/vue'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
// import mermaid from '@bytemd/plugin-mermaid';
import { markdownText } from '@bytemd/example-utils'

export default {
  components: {
    Editor,
    Viewer,
  },
  data() {
    return {
      value: markdownText,
      enabled: {
        highlight: true,
        math: true,
        mermaid: true,
      },
    }
  },
  computed: {
    enabledPlugins() {
      return [
        this.enabled.highlight && highlight(),
        this.enabled.math && math(),
        // mermaid: enabled.mermaid && mermaid(),
      ]
    },
  },
  methods: {
    handleChange(v) {
      this.value = v
    },
    handlePluginChange($event, p) {
      this.enabled[p] = $event.target.checked
    },
  },
}
</script>

<style>
body {
  margin: 0 10px;
}
.bytemd {
  height: 90vh !important;
}
</style>
