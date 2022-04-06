// @ts-check
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ByteMD',
  description: 'A hackable Markdown editor component',
  themeConfig: {
    repo: 'bytedance/bytemd',
    nav: [
      {
        text: 'Playground',
        link: 'https://bytemd.js.org/playground/',
      },
    ],
  },
})
