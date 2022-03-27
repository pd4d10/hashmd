<template>
  <Editor :value="value" @change="handleChange" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Editor } from '@bytemd/vue'
import 'bytemd/dist/index.css'

export default Vue.extend({
  name: 'IndexPage',
  data() {
    return {
      value: '',
    }
  },
  methods: {
    handleChange(v: string) {
      this.$data.value = v
    },
  },
  components: { Editor },
})
</script>

<style>
#__layout {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
