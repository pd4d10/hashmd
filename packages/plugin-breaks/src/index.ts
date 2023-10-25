import type { Plugin } from "hashmd";
import remarkBreaks from "remark-breaks";

export default function breaks(): Plugin {
  return {
    remark: (processor) => processor.use<any, any>(remarkBreaks),
  };
}
