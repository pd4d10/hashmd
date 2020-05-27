import { BytemdPlugin } from 'bytemd';
import ToolbarIcon from './toolbar-icon.svelte';
import Text from './styled-text.svelte';
import '@simonwep/pickr/dist/themes/nano.min.css';

export default function styledText(): BytemdPlugin {
  return {
    renderNode(node) {
      if (node.tagName !== 'span') return;
      return {
        component: Text,
        props: {
          children: node.children,
          style: node.properties.style,
        },
      };
    },
    toolbarItems: [
      {
        component: ToolbarIcon,
        tooltip: 'styled text',
      },
    ],
  };
}
