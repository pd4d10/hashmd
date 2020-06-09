import unified from 'unified';
import markdown from 'remark-parse';
import rehype from 'remark-rehype';
import raw from 'rehype-raw';
import sanitize from 'rehype-sanitize';
import stringify from 'rehype-stringify';
import { BytemdPlugin } from 'bytemd';

export function getParser(plugins: BytemdPlugin[]) {
  let parser = unified()
    .use(markdown)
    .use(rehype, { allowDangerousHTML: true })
    .use(raw)
    .use(sanitize)
    .use(stringify);

  // TODO:
  // plugins.forEach((p) => {
  //   if (Array.isArray(p.transformer)) {
  //     parser = parser.use(...p.transformer);
  //   } else if (p.transformer) {
  //     parser = parser.use(p.transformer);
  //   }
  // });

  return parser;
}
