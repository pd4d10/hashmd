import type { Plugin } from "hashmd";
import rehypeHighlight, { Options } from "rehype-highlight";

export default function highlightSsr(options: Options = {}): Plugin {
  return {
    rehype: (processor) => processor.use<any, any>(rehypeHighlight, options),
  };
}
