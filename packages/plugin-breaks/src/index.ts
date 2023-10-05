import type { HashmdPlugin } from "hashmd";
import remarkBreaks from "remark-breaks";

export default function breaks(): HashmdPlugin {
  return {
    remark: (processor) => processor.use<any, any>(remarkBreaks),
  };
}
