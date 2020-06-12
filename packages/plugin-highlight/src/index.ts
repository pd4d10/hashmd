import { BytemdPlugin } from 'bytemd';
import rehypeHighlight from 'rehype-highlight';

export default function highlight(): BytemdPlugin {
  return {
    rehypeTransformer: (u) => u.use(rehypeHighlight, { ignoreMissing: true }),
  };
}
