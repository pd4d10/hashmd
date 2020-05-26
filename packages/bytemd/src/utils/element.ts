import { Plugin } from 'bytemd';
import { HastNode } from '../../helpers';

export function findPlugin(node: HastNode, plugins: Plugin[]) {
  for (let i = 0; i < plugins.length; i++) {
    const { renderNode } = plugins[i];
    if (renderNode) {
      return renderNode(node);
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
