import type { Plugin } from 'unified';
import type { BytemdPlugin } from 'bytemd';
import remarkFrontmatter from 'remark-frontmatter';
import { safeLoad } from 'js-yaml';

const remarkFrontmatterParse: Plugin = () => {
  return (tree: any, file) => {
    // console.log(tree);
    const fisrtNode = tree.children[0];
    if (fisrtNode?.type === 'yaml') {
      try {
        file.data = {
          ...(file.data as any),
          frontmatter: safeLoad(fisrtNode.value),
        };
      } catch {}
    }
  };
};

export default function frontmatter(): BytemdPlugin {
  return {
    remark: (p) => p.use(remarkFrontmatter).use(remarkFrontmatterParse),
  };
}
