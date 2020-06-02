import { BytemdPlugin } from 'bytemd';
import { HastNode } from '../helpers';

export function findPlugin(node: HastNode, plugins: BytemdPlugin[]) {
  for (let i = 0; i < plugins.length; i++) {
    const { renderNode } = plugins[i];
    if (renderNode) {
      const res = renderNode(node);
      if (res) return res;
    }
  }
}

export const santitizeHref = (href?: string) => {
  if (href && href.trim().toLowerCase().startsWith('javascript')) {
    return;
  } else {
    return href;
  }
};
