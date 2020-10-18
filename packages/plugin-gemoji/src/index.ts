import type { BytemdPlugin } from 'bytemd';
// @ts-ignore
import remarkGemoji from 'remark-gemoji';

export default function gemoji(): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkGemoji),
  };
}
