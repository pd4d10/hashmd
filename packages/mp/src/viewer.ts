/// <reference types="miniprogram-api-typings" />
import { processSync } from 'bytemd';

Component({
  properties: {
    value: String,
  },
  data: {
    nodes: [],
  },
  observers: {
    value(v) {
      const res = processSync({ value: v });
      console.log(res.hast);
      this.setData({ nodes: res.hast.children as any });
    },
  },
});
