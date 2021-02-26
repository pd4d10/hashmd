// Modified from: https://github.com/mdx-js/mdx/blob/main/packages/remark-mdx/index.js
// TODO: Use NPM package

let syntaxMdx = require('micromark-extension-mdx');
let fromMarkdown = require('mdast-util-mdx/from-markdown');
let toMarkdown = require('mdast-util-mdx/to-markdown');

export default function mdx() {
  // @ts-ignore
  let data = this.data();

  add('micromarkExtensions', syntaxMdx());
  add('fromMarkdownExtensions', fromMarkdown);
  add('toMarkdownExtensions', toMarkdown);

  // @ts-ignore
  function add(field, value) {
    /* istanbul ignore if - other extensions. */
    if (data[field]) data[field].push(value);
    else data[field] = [value];
  }
}
