import unified from 'unified';
import remark from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import stringify from 'rehype-stringify';
import merge from 'deepmerge';
import ghSchema from 'hast-util-sanitize/lib/github.json';
import { BytemdPlugin } from '.';

export function processMarkdown(value: string, plugins: BytemdPlugin[] = []) {
  let parser = unified().use(remark);

  plugins.forEach(({ remarkTransformer }) => {
    if (remarkTransformer) parser = remarkTransformer(parser);
  });

  parser = parser
    .use(remarkRehype, { allowDangerousHTML: true })
    .use(rehypeRaw);

  let schema = ghSchema;
  plugins.forEach(({ markdownSanitizeSchema }) => {
    if (markdownSanitizeSchema) schema = merge(schema, markdownSanitizeSchema);
  });

  parser = parser.use(rehypeSanitize, schema);

  plugins.forEach(({ rehypeTransformer }) => {
    if (rehypeTransformer) parser = rehypeTransformer(parser);
  });

  parser = parser.use(stringify);

  return parser.processSync(value).toString();
}
