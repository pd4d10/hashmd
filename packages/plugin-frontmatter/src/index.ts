import type { BytemdPlugin } from 'bytemd'
import remarkFrontmatter from 'remark-frontmatter'
import { safeLoad } from 'js-yaml'

export interface BytemdPluginFrontmatterOptions {
  onError?(err: any): void
}

declare module 'vfile' {
  interface VFile {
    frontmatter: ReturnType<typeof safeLoad>
  }
}

export default function frontmatter({
  onError,
}: BytemdPluginFrontmatterOptions = {}): BytemdPlugin {
  return {
    remark: (p) =>
      p.use(remarkFrontmatter).use(() => (tree: any, file) => {
        // console.log(tree);
        const fisrtNode = tree.children[0]
        if (fisrtNode?.type !== 'yaml') return

        try {
          file.frontmatter = safeLoad(fisrtNode.value)
        } catch (err) {
          onError?.(err)
        }
      }),
  }
}
