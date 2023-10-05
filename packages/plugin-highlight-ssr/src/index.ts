import type { HashmdPlugin } from "hashmd";
import rehypeHighlight, { Options } from "rehype-highlight";

export default function highlightSsr(options: Options = {}): HashmdPlugin {
  return {
    rehype: (processor) => processor.use<any, any>(rehypeHighlight, options),
  };
}
