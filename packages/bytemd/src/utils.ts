import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import ghSchema from 'hast-util-sanitize/lib/github.json';
import type { Schema } from 'hast-util-sanitize';
import type { ViewerContext, ViewerProps } from './types';

const schemaStr = JSON.stringify(ghSchema);

/**
 * Get unified processor with ByteMD plugins
 */
function getProcessor({ sanitize, plugins }: Omit<ViewerProps, 'value'>) {
  let p = unified().use(remarkParse);

  plugins?.forEach(({ remark }) => {
    if (remark) p = remark(p);
  });

  p = p.use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw);

  let schema = JSON.parse(schemaStr) as Schema;
  schema.attributes!['*'].push('className'); // Allow class names by default

  if (typeof sanitize === 'function') {
    schema = sanitize(schema);
  } else if (sanitize?.allowStyle) {
    schema.attributes!['*'].push('style');
  }

  p = p.use(rehypeSanitize, schema);

  plugins?.forEach(({ rehype }) => {
    if (rehype) p = rehype(p);
  });

  return p.use(rehypeStringify);
}

export function processSync(props: ViewerProps): Omit<ViewerContext, '$el'> {
  let mdast: ViewerContext['mdast'] = { type: 'root', children: [] };
  let hast: ViewerContext['hast'] = { type: 'root', children: [] };

  const processor = getProcessor({
    ...props,
    plugins: [
      ...(props.plugins ?? []),
      {
        remark: (p) =>
          p.use(() => (tree) => {
            mdast = tree as any;
          }),
        rehype: (p) =>
          p.use(() => (tree) => {
            hast = tree as any;
          }),
      },
    ],
  });
  const vfile = processor.processSync(props.value);
  return {
    vfile,
    html: vfile.toString(),
    mdast,
    hast,
  };
}
