import type { BytemdPlugin } from 'bytemd';
import type { Mermaid } from 'mermaid';
import type mermaidAPI from 'mermaid/mermaidAPI';

export default function mermaid(options?: mermaidAPI.Config): BytemdPlugin {
  let m: Mermaid;

  return {
    viewerEffect({ $el }) {
      (async () => {
        const els = $el.querySelectorAll<HTMLElement>(
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
          const pre = el.parentElement!;
          const source = el.innerText;

          const container = document.createElement('div');
          container.classList.add('bytemd-mermaid');
          pre.replaceWith(container);

          try {
            m.render(
              `bytemd-mermaid-${Date.now()}-${i}`,
              source,
              (svgCode) => {
                container.innerHTML = svgCode;
              },
              // @ts-ignore
              container
            );
          } catch (err) {
            // console.error(err);
          }
        });
      })();
    },
  };
}
