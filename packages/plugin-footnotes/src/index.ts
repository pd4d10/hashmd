import { BytemdPlugin } from 'bytemd';
import remarkFootnotes, { RemarkFootnotesOptions } from 'remark-footnotes';

export default function footnotes(
  options?: RemarkFootnotesOptions
): BytemdPlugin {
  return {
    remark: (u) => u.use(remarkFootnotes, options),
  };
}
