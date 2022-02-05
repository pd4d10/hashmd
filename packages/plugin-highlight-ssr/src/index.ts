import type { BytemdPlugin } from 'bytemd'
import rehypeHighlight, { Options } from 'rehype-highlight'

export default function highlightSsr({
  subset = false,
  ignoreMissing = true,
  ...rest
}: Options): BytemdPlugin {
  return {
    rehype: (u) => u.use(rehypeHighlight, { subset, ignoreMissing, ...rest }),
  }
}
