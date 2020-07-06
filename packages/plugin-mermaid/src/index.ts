import { BytemdPlugin } from 'bytemd';
import m from 'mermaid';
import mermaidAPI from 'mermaid/mermaidAPI';

export default function mermaid(options?: mermaidAPI.Config): BytemdPlugin {
  return {
    sanitizeSchema: {
      attributes: {
        code: ['className'],
      },
    },
    viewerEffect(el) {
      if (options) {
        m.initialize(options);
      }
      const els = el.querySelectorAll<HTMLElement>('pre>code.language-mermaid');
      els.forEach((el, i) => {
        try {
          const pre = el.parentElement!;
          m.render(
            `bytemd-mermaid-${i}`,
            el.innerText,
            (svgCode) => {
              pre.innerHTML = svgCode;
            },
            // @ts-ignore
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
