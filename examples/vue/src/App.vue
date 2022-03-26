<template>
  <div id="app">
    <Editor :value="value" @change="handleChange" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Editor } from '@bytemd/vue'
import 'bytemd/dist/index.css'

export default Vue.extend({
  name: 'App',
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  max-width: 1200px;
  margin: 0 auto;
}
</style>
