import type { HashmdPlugin } from "hashmd";
import remarkGemoji from "remark-gemoji";

export default function gemoji(): HashmdPlugin {
  return {
    remark: (processor) => processor.use<any, any>(remarkGemoji),
  };
}
