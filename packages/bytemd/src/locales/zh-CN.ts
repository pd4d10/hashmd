import { BytemdLocale } from './en-US';

const locale: BytemdLocale = {
  toolbar: {
    write: '编辑',
    preview: '预览',
    left: '仅编辑',
    right: '仅预览',
    help: '帮助',
    toc: '目录',
    fullscreen: '全屏',
    about: '关于',
  },
  sidebar: {
    toc: '目录',
    cheatsheet: 'Markdown 语法',
    shortcuts: '快捷键',
  },
  status: {
    bytes: '字节',
    lines: '行数',
    sync: '滚动同步',
    top: '回到顶部',
  },
  heading: {
    title: '标题',
    cheatsheet: '## 标题',
    h1: '一级标题',
    h2: '二级标题',
    h3: '三级标题',
    h4: '四级标题',
    h5: '五级标题',
    h6: '六级标题',
    p: '段落',
  },
  bold: {
    title: '粗体',
    cheatsheet: '**粗体文本**',
  },
  italic: {
    title: '斜体',
    cheatsheet: '_斜体文本_',
  },
  quote: {
    title: '引用',
    cheatsheet: '> 引用',
  },
  link: {
    title: '链接',
    cheatsheet: '[文本](url)',
  },
  image: {
    title: '图片',
    cheatsheet: '![alt](url)',
  },
  code: {
    title: '代码',
    cheatsheet: '`代码`',
  },
  pre: {
    title: '代码块',
    cheatsheet: '```编程语言',
  },
  ul: {
    title: '无序列表',
    cheatsheet: '- 项目 1',
  },
  ol: {
    title: '有序列表',
    cheatsheet: '1. 项目 1',
  },
  hr: {
    title: '水平线',
    cheatsheet: '---',
  },
};

export default locale;
