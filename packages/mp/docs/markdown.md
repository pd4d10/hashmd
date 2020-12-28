# markdown

markdown组件。

## 属性列表

| 属性                 | 类型        | 默认值  | 必填 | 说明                                              |
| -------------------- | ----------- | ------- | ---- | ------------------------------------------------- |
| md            | String      |         | 是   | 需要渲染的markdown文本                                        |
| highlight            | Boolean      |     false    | 否  | 代码是否高亮                                       |

### 注意事项
 - 需要在app.json中添加"recursion-node": "components/markdown/index"， 用以markdown组件自调用

### 示例代码

<mp-markdown md="{{markdown}}" highlight></mp-markdown>