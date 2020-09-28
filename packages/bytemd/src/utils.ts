import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
// @ts-ignore
import rehypeRaw from 'rehype-raw';
// @ts-ignore
import rehypeSanitize from 'rehype-sanitize';
import stringify from 'rehype-stringify';
// @ts-ignore
import ghSchema from 'hast-util-sanitize/lib/github.json';
import type { ViewerProps } from './types';

const schemaStr = JSON.stringify(ghSchema);

export function getProcessor({
  sanitize,
  plugins,
}: Omit<ViewerProps, 'value'>) {
  let p = unified().use(remarkParse);

  plugins?.forEach(({ remark }) => {
    if (remark) p = remark(p);
  });

  p = p.use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw);

  let schema = JSON.parse(schemaStr);
  schema.attributes['*'].push('className'); // Add className
  schema.clobber = schema.clobber.filter((vs: string) => vs !== 'id'); // Keep id as is
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
