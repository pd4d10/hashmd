import { BytemdPlugin } from 'bytemd';
import mermaid from 'mermaid';

export default function bytemdMermaid(): BytemdPlugin {
  return {
    markdownSanitizeSchema: {
      attributes: {
        code: ['className'],
      },
    },
    onMount(el) {
      const els = el.querySelectorAll<HTMLElement>('pre>code.language-mermaid');
      els.forEach((el, i) => {
        try {
          const pre = el.parentElement!;
          mermaid.render(
            `bytemd-mermaid-${i}`,
            el.innerText,
            (svgCode) => {
              pre.innerHTML = svgCode;
            },
            pre
          );
          pre.replaceWith(pre.children[0]);
        } catch (err) {
          console.error(err);
        }
      });
    },
  };
}
