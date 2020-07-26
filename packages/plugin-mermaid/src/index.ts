import { BytemdPlugin } from 'bytemd';
import { Mermaid } from 'mermaid';
import mermaidAPI from 'mermaid/mermaidAPI';

export default function mermaid(options?: mermaidAPI.Config): BytemdPlugin {
  let m: Mermaid;
  return {
    viewerEffect(el) {
      (async () => {
        const els = el.querySelectorAll<HTMLElement>(
          'pre>code.language-mermaid'
        );
        if (els.length === 0) return;

        if (!m) {
          m = await import('mermaid').then((c) => c.default);
          if (options) {
            m.initialize(options);
          }
        }

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
      })();
    },
  };
}
