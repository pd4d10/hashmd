/// <reference types="miniprogram-api-typings" />
import { getProcessor } from 'bytemd';

const processor = getProcessor({});

Component({
  properties: {
    value: String,
  },
  data: {
    nodes: [],
  },
  observers: {
    value(v) {
      const ast = processor.runSync(processor.parse(v));
      console.log(ast);
      this.setData({ nodes: ast.children as any });
    },
  },
});
