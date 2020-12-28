const { getProcessor } = require("./libs/bytemd.min.js");
const gfm = require("./libs/gfm.min.js");
const highlight = require("./libs/highlight.min.js");

Component({
  properties: {
    md: {
      type: String,
      value: '',
      observer: function (newval, oldval) {
        this.getMDNodes(newval)
      },
    }, 
		highlight: {
			type: Boolean,
			value: false
		},
    _pnode: null, // Used for recursive rendering
    _code: null // Used for recursive rendering
  },
  data: {
    nodes: {},
  },
  methods: {
    getMDNodes(md) {
      const processor = getProcessor({
        plugins: [
          gfm(),
          this.data.highlight && highlight({
            subset: ["javascript", "html", "css"]
          })
        ]
      });
      const ast = processor.runSync(processor.parse(md));
      ast.children = this.recursiveTree(ast.children, ast);
      this.setData({ nodes: ast });
    },
    recursiveTree(array, parentNode) {
      array = array.filter((item) => {
        if (item.children && typeof Array.isArray(item.children)) {
          item.children = this.recursiveTree(item.children, item);
        }
        return !(item.type === 'text' && item.value.trim() === '' && parentNode.tagName !== "code" && parentNode.tagName !== "span")
      })
      return array
    },
    imagePreview({
      currentTarget: {
        dataset: { src }
      }
    }) {
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: [src] // 需要预览的图片http链接列表
      })
    }
  }
});
