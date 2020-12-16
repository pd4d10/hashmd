import type { BytemdPlugin } from 'bytemd';
import type { Mermaid } from 'mermaid';
import type mermaidAPI from 'mermaid/mermaidAPI';
import { icons } from './icons';

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
    toolbar: {
      mermaid: {
        tooltip: 'Mermaid diagram',
        icon: icons.mermaid,
        onClick({ editor, utils }) {
          const { startLine } = utils.appendBlock(
            '```mermaid\ngraph LR\nA--->B\n```'
          );
          editor.setSelection(
            { line: startLine + 1, ch: 0 }, // @ts-ignore
            { line: startLine + 2 }
          );
        },
      },
    },
  };
}
