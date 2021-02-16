import type { BytemdPlugin } from 'bytemd';
import type { Mermaid } from 'mermaid';
import type mermaidAPI from 'mermaid/mermaidAPI';
import { icons } from './icons';
import enUS, { Locale } from './locales/en-US';

export interface BytemdPluginMermaidOptions extends mermaidAPI.Config {
  locale?: Locale;
}

export default function mermaid({
  locale = enUS,
  ...mermaidConfig
}: BytemdPluginMermaidOptions = {}): BytemdPlugin {
  let m: Mermaid;

  return {
    viewerEffect({ markdownBody }) {
      (async () => {
        const els = markdownBody.querySelectorAll<HTMLElement>(
          'pre>code.language-mermaid'
        );
        if (els.length === 0) return;

        if (!m) {
          m = await import('mermaid').then((c) => c.default);
          if (mermaidConfig) {
            m.initialize(mermaidConfig);
          }
        }

        els.forEach((el, i) => {
          const pre = el.parentElement!;
          const source = el.innerText;

          const container = document.createElement('div');
          container.classList.add('bytemd-mermaid');
          container.style.lineHeight = 'initial'; // reset line-height
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
    action: {
      icon: icons.mermaid,
      handler({ editor, appendBlock }) {
        const { line } = appendBlock('```mermaid\ngraph LR\nA--->B\n```');
        editor.setSelection(
          { line: line + 1, ch: 0 },
          { line: line + 2, ch: Infinity }
        );
        editor.focus();
      },
      ...locale,
    },
  };
}
