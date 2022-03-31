import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import { defaultSchema } from 'hast-util-sanitize'
import type { Schema } from 'hast-util-sanitize'
import type { Processor } from 'unified'
import type { ViewerProps } from './types'

const schemaStr = JSON.stringify(defaultSchema)

/**
 * Get unified processor with ByteMD plugins
 */
export function getProcessor({
  sanitize,
  plugins,
}: Omit<ViewerProps, 'value'>) {
  let processor: Processor = unified().use(remarkParse)

  plugins?.forEach(({ remark }) => {
    if (remark) processor = remark(processor)
  })

  processor = processor
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)

  let schema = JSON.parse(schemaStr) as Schema
  schema.attributes!['*'].push('className') // Allow class names by default

  if (typeof sanitize === 'function') {
    schema = sanitize(schema)
  }

  processor = processor.use(rehypeSanitize, schema)

  plugins?.forEach(({ rehype }) => {
    if (rehype) processor = rehype(processor)
  })

  return processor.use(rehypeStringify)
}
