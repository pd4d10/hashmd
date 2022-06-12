// @ts-check
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ByteMD',
  description: 'Hackable Markdown Editor and Viewer',
  themeConfig: {
    nav: [
      {
        text: 'Playground',
        link: 'https://bytemd.js.org/playground/',
      },
      {
        text: 'Source Code',
        link: 'https://github.com/bytedance/bytemd',
      },
    ],
  },
})
