import type { HashmdPlugin } from 'hashmd'
import rehypeHighlight, { Options } from 'rehype-highlight'

export default function highlightSsr({
  ignoreMissing = true,
  ...rest
}: Options = {}): HashmdPlugin {
  return {
    rehype: (processor) =>
      processor.use(rehypeHighlight, { ignoreMissing, ...rest }),
  }
}
