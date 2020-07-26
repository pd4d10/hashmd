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

export function getProcessor({
  sanitize,
  plugins,
}: Omit<ViewerProps, 'value'>) {
  let p = unified().use(remarkParse);

  plugins?.forEach(({ remark }) => {
    if (remark) p = remark(p);
  });

  p = p.use(remarkRehype, { allowDangerousHTML: true }).use(rehypeRaw);

  let schema = ghSchema;
  schema.attributes['*'].push('className'); // Add className
  if (sanitize) schema = sanitize(schema);

  p = p.use(rehypeSanitize, schema);

  plugins?.forEach(({ rehype }) => {
    if (rehype) p = rehype(p);
  });

  p = p.use(stringify);

  // console.log(parser.parse(value));
  return p;
}

export function processMarkdown({ value, ...rest }: ViewerProps) {
  return getProcessor(rest).processSync(value).toString();
}
