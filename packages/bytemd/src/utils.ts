import unified from 'unified';
import remarkParse from 'remark-parse';
// @ts-ignore
import remarkRehype from 'remark-rehype';
// @ts-ignore
import rehypeRaw from 'rehype-raw';
// @ts-ignore
import rehypeSanitize from 'rehype-sanitize';
import stringify from 'rehype-stringify';
// @ts-ignore
import ghSchema from 'hast-util-sanitize/lib/github.json';
import { ViewerProps } from '.';

export function processMarkdown({
  value,
  sanitize,
  plugins = [],
}: ViewerProps) {
  let parser = unified().use(remarkParse);

  plugins.forEach(({ remark }) => {
    if (remark) parser = remark(parser);
  });

  parser = parser
    .use(remarkRehype, { allowDangerousHTML: true })
    .use(rehypeRaw);

  let schema = ghSchema;
  schema.attributes['*'].push('className'); // Add className
  if (sanitize) schema = sanitize(schema);

  parser = parser.use(rehypeSanitize, schema);

  plugins.forEach(({ rehype }) => {
    if (rehype) parser = rehype(parser);
  });

  parser = parser.use(stringify);

  // console.log(parser.parse(value));
  return parser.processSync(value).toString();
}
