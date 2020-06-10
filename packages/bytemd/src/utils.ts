import unified from 'unified';
import remark from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import stringify from 'rehype-stringify';
import { UnifiedTransformer } from '.';

export function processMarkdown(
  value: string,
  remarkTransformer: UnifiedTransformer,
  rehypeTransformer: UnifiedTransformer
) {
  let parser = unified().use(remark);

  if (remarkTransformer) {
    parser = remarkTransformer(parser);
  }

  parser = parser
    .use(remarkRehype, { allowDangerousHTML: true })
    .use(rehypeRaw);

  if (rehypeTransformer) parser = rehypeTransformer(parser);

  parser = parser.use(rehypeSanitize).use(stringify);

  return parser.processSync(value).toString();
}
