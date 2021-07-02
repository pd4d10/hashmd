/// <reference types="miniprogram-api-typings" />
import { getProcessor } from 'bytemd'

Component({
  properties: {
    value: String,
  },
  data: {
    nodes: [],
  },
  observers: {
    value(v) {
      const res = getProcessor({}).processSync({ value: v })
      console.log(res)
      this.setData({ nodes: res as any })
    },
  },
})
