import type { BytemdPlugin } from 'bytemd';
import type { Mermaid } from 'mermaid';
import type mermaidAPI from 'mermaid/mermaidAPI';
import { icons } from './icons';
import enUS, { Locale } from './locales/en-US';

export interface BytemdPluginMermaidOptions {
  locale?: Locale;
  mermaidConfig?: mermaidAPI.Config;
}

export default function mermaid({
  locale = enUS,
  mermaidConfig,
}: BytemdPluginMermaidOptions = {}): BytemdPlugin {
  let m: Mermaid;

  return {
    effect({ markdownBody }) {
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
        const { startLine } = appendBlock('```mermaid\ngraph LR\nA--->B\n```');
        editor.setSelection(
          { line: startLine + 1, ch: 0 }, // @ts-ignore
          { line: startLine + 2 }
        );
      },
      ...locale,
    },
  };
}
