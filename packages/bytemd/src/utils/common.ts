import unified from 'unified';
import markdown from 'remark-parse';
import rehype from 'remark-rehype';
import raw from 'rehype-raw';
import { Plugin } from 'bytemd';

export function getParser(plugins: Plugin[]) {
  let parser = unified()
    .use(markdown)
    .use(rehype, { allowDangerousHTML: true });

  plugins.forEach((p) => {
    if (Array.isArray(p.transformer)) {
      parser = parser.use(...p.transformer);
    } else if (p.transformer) {
      parser = parser.use(p.transformer);
    }
  });

  return parser.use(raw);
}
