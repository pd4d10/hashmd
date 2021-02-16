import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import ghSchema from 'hast-util-sanitize/lib/github.json';
import type { Schema } from 'hast-util-sanitize';
import type { ViewerProps } from './types';

const schemaStr = JSON.stringify(ghSchema);

/**
 * Get unified processor with ByteMD plugins
 */
export function getProcessor({
  sanitize,
  plugins,
}: Omit<ViewerProps, 'value'>) {
  let p = unified().use(remarkParse);

  plugins?.forEach(({ remark }) => {
    if (remark) p = remark(p);
  });

  p = p.use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw);

  let schema = JSON.parse(schemaStr) as Schema;
  schema.attributes!['*'].push('className'); // Allow class names by default

  if (typeof sanitize === 'function') {
    schema = sanitize(schema);
  }

  p = p.use(rehypeSanitize, schema);

  plugins?.forEach(({ rehype }) => {
    if (rehype) p = rehype(p);
  });

  return p.use(rehypeStringify);
}
