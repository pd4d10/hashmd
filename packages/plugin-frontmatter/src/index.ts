import type { Plugin } from "hashmd";
import { load } from "js-yaml";
import remarkFrontmatter from "remark-frontmatter";

export interface HashmdPluginFrontmatterOptions {
  onError?(err: any): void;
}

declare module "vfile" {
  interface VFile {
    frontmatter: ReturnType<typeof load>;
  }
}

export default function frontmatter({
  onError,
}: HashmdPluginFrontmatterOptions = {}): Plugin {
  return {
    remark: (processor) =>
      // @ts-ignore
      processor.use(remarkFrontmatter).use<any, any>(() => (tree, file) => {
        // TODO: arg types
        // console.log(tree);
        const fisrtNode = tree.children[0];
        if (fisrtNode?.type !== "yaml") return;

        try {
          file.frontmatter = load(fisrtNode.value);
        } catch (err) {
          onError?.(err);
        }
      }),
  };
}
