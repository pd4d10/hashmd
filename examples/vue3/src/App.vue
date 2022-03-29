<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'
import 'bytemd/dist/index.css'

let content = ref('')

const plugins = [gfm()]

const handleChange = (v: string) => {
  content.value = v
}
</script>

<template>
  <main>
    <Editor :value="content" :plugins="plugins" @change="handleChange" />
  </main>
</template>

<style>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}
</style>
