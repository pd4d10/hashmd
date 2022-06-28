<script setup lang="ts">
import { Editor } from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'

const content = ref('')
const plugins = [gfm()]
const handleChange = (v: string) => {
  content.value = v
}
</script>

<template>
  <ClientOnly>
    <Editor :value="content" :plugins="plugins" @change="handleChange" />
  </ClientOnly>
</template>
