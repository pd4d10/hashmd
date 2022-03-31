import type { BytemdPlugin } from 'bytemd'
import remarkGemoji from 'remark-gemoji'

export default function gemoji(): BytemdPlugin {
  return {
    remark: (processor) => processor.use(remarkGemoji),
  }
}
