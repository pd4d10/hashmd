import type { BytemdPlugin } from 'bytemd';
import remarkFrontmatter from 'remark-frontmatter';
import { safeLoad } from 'js-yaml';

export interface FrontmatterOptions {
  onError?(err: any): void;
}

export default function frontmatter({
  onError,
}: FrontmatterOptions = {}): BytemdPlugin {
  return {
    remark: (p) =>
      p.use(remarkFrontmatter).use(() => (tree: any, file) => {
        // console.log(tree);
        const fisrtNode = tree.children[0];
        if (fisrtNode?.type !== 'yaml') return;

        let frontmatter: ReturnType<typeof safeLoad>;
        try {
          frontmatter = safeLoad(fisrtNode.value);
        } catch (err) {
          onError?.(err);
        }

        if (frontmatter != null) {
          (file.data as any).frontmatter = frontmatter;
        }
      }),
  };
}
