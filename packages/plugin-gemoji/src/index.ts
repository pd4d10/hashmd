import type { Plugin } from "hashmd";
import remarkGemoji from "remark-gemoji";

export default function gemoji(): Plugin {
  return {
    remark: (processor) => processor.use<any, any>(remarkGemoji),
  };
}
