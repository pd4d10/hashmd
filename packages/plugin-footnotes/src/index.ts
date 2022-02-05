import type { BytemdPlugin } from 'bytemd'
import remarkFootnotes, { Options } from 'remark-footnotes'

export default function footnotes(options?: Options): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkFootnotes, options),
  }
}
