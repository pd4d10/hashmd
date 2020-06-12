import { BytemdPlugin } from 'bytemd';
import visit from 'unist-util-visit';
import mermaid from 'mermaid';

function remarkMermaid() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (node.lang === 'mermaid') {
        node.type = 'html';
        node.value = `<div class="bytemd-mermaid" value="${node.value}"></div>`;
      }
    });
  };
}

export default function bytemdMermaid(): BytemdPlugin {
  return {
    remarkTransformer: (u) => u.use(remarkMermaid),
    markdownSanitizeSchema: {
      attributes: {
        div: ['className'],
      },
    },
    onMount(el) {
      const els = el.querySelectorAll('.bytemd-mermaid');
      els.forEach((el, i) => {
        mermaid.render(
          `bytemd-mermaid-${i}`,
          el.getAttribute('value')!,
          (svgCode) => {
            el.innerHTML = svgCode;
          },
          el
        );
      });
    },
  };
}
