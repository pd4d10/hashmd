const md = require("./demo.md");
Page({
  data: {
    markdown: '#h1'
  },

  onLoad() {
    const markdown = md
    this.setData({markdown})
  }
})
